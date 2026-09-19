import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Snap2Form's document-understanding engine.
 *
 * This module is the ONLY place that talks to a multimodal AI provider.
 * Everything downstream (routes, storage, the frontend) works purely with
 * the validated GeneratedFormSchema — it never depends on which provider
 * produced it. Swapping providers means editing only this file.
 */

const REQUEST_TIMEOUT_MS = 25_000;

export type AIErrorCode = "AI_UNAVAILABLE" | "AI_TIMEOUT" | "INVALID_AI_RESPONSE";

export class AIError extends Error {
  code: AIErrorCode;
  constructor(code: AIErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "AIError";
  }
}

export const SYSTEM_PROMPT = `You are Snap2Form's document understanding engine.

Your job is to inspect an image of a paper form, checklist, application form, registration form, warehouse sheet, inspection form, service request, delivery sheet, order sheet, or similar structured document.

You are NOT simply performing OCR. Your job is to understand the semantic structure and intended input type of every user-fillable field.

For example:
- "Quantity" should normally become a number input.
- "Phone" should become a phone input.
- "Email" should become an email input.
- "Date" should become a date input.
- "Damaged? Yes / No" should become a boolean input.
- "Repair / Cleaning / Installation" should become a select field when only one choice is intended.
- A group of independent checkboxes should become a checkbox-group when multiple selections are allowed.
- "Description", "Notes", "Problem", or similar long-answer fields should normally become textarea.

Determine:
- document title
- optional short description
- detected language (as an ISO 639-1 code such as "en", "az", "ru")
- field labels
- field types
- choices/options
- whether each field is required when reasonably clear

Never invent important fields that are not visible. Never invent options. If something is uncertain, choose the safest generic interpretation. If the image does not contain a clear form or checklist, return a no-form-detected response.

ONLY use these field types: text, number, textarea, boolean, select, checkbox-group, date, email, phone.

Return STRICT JSON ONLY. No markdown. No prose. No code fences. No comments.

Success response shape:
{
  "status": "success",
  "title": "Warehouse Delivery",
  "description": "Form for recording warehouse deliveries",
  "detectedLanguage": "en",
  "fields": [
    { "id": "supplier", "label": "Supplier", "type": "text", "required": true, "placeholder": "Enter supplier" },
    { "id": "quantity", "label": "Quantity", "type": "number", "required": true },
    { "id": "device", "label": "Device", "type": "select", "required": true, "options": ["iPhone", "Android", "Laptop"] },
    { "id": "damaged", "label": "Damaged?", "type": "boolean", "required": false }
  ]
}

Failure response shape (used when no clear form/checklist is visible):
{
  "status": "no_form_detected",
  "title": null,
  "description": null,
  "detectedLanguage": null,
  "fields": []
}`;

const USER_PROMPT =
  "Analyze this paper document image and return the structured form JSON described in your instructions. Return JSON only.";

interface Provider {
  name: string;
  analyze(imageBase64: string, mimeType: string, signal: AbortSignal): Promise<string>;
}

class OpenAIProvider implements Provider {
  name = "openai";
  private client: OpenAI;
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }
  async analyze(imageBase64: string, mimeType: string, signal: AbortSignal): Promise<string> {
    const response = await this.client.chat.completions.create(
      {
        model: "gpt-4o-mini",
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: USER_PROMPT },
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
            ]
          }
        ]
      },
      { signal }
    );
    const text = response.choices[0]?.message?.content;
    if (!text) throw new AIError("INVALID_AI_RESPONSE", "AI response contained no content");
    return text;
  }
}

class AnthropicProvider implements Provider {
  name = "anthropic";
  private client: Anthropic;
  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }
  async analyze(imageBase64: string, mimeType: string, signal: AbortSignal): Promise<string> {
    const response = await this.client.messages.create(
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mimeType as "image/jpeg", data: imageBase64 }
              },
              { type: "text", text: USER_PROMPT }
            ]
          }
        ]
      },
      { signal }
    );
    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      throw new AIError("INVALID_AI_RESPONSE", "AI response contained no text block");
    }
    return block.text;
  }
}

function getProvider(): Provider {
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey) return new OpenAIProvider(openaiKey);
  if (anthropicKey) return new AnthropicProvider(anthropicKey);

  throw new AIError(
    "AI_UNAVAILABLE",
    "No AI provider configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment to enable live document analysis. Try Demo Mode in the meantime."
  );
}

export function isAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);
}

/**
 * Sends an image to the configured multimodal provider and returns the raw
 * text it produced. The caller (formValidation.ts) is responsible for safely
 * extracting and validating JSON from this text — it must never be trusted
 * or executed directly.
 */
export async function analyzeDocumentImage(imageBase64: string, mimeType: string): Promise<string> {
  const provider = getProvider();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await provider.analyze(imageBase64, mimeType, controller.signal);
  } catch (err) {
    if (err instanceof AIError) throw err;
    if (controller.signal.aborted) {
      throw new AIError("AI_TIMEOUT", "The AI provider took too long to respond. Please try again.");
    }
    const message = err instanceof Error ? err.message : "Unknown AI provider error";
    throw new AIError("AI_UNAVAILABLE", `AI analysis is temporarily unavailable (${message}).`);
  } finally {
    clearTimeout(timeout);
  }
}
