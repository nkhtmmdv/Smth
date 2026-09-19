import { GeneratedFormSchema, type GeneratedForm, type GeneratedField } from "../../shared/schema.js";

export class SubmissionValidationError extends Error {
  fieldErrors: Record<string, string>;
  constructor(fieldErrors: Record<string, string>) {
    super("Submission validation failed");
    this.name = "SubmissionValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class InvalidAIResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAIResponseError";
  }
}

/**
 * AI models sometimes wrap JSON in markdown code fences or add stray prose
 * even when told not to. Safely extract the first plausible JSON object
 * without ever calling eval.
 */
export function extractJson(raw: string): unknown {
  const trimmed = raw.trim();

  const tryParse = (candidate: string): unknown | undefined => {
    try {
      return JSON.parse(candidate);
    } catch {
      return undefined;
    }
  };

  const direct = tryParse(trimmed);
  if (direct !== undefined) return direct;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    const fromFence = tryParse(fenced[1].trim());
    if (fromFence !== undefined) return fromFence;
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const slice = trimmed.slice(firstBrace, lastBrace + 1);
    const fromSlice = tryParse(slice);
    if (fromSlice !== undefined) return fromSlice;
  }

  throw new InvalidAIResponseError("Could not extract valid JSON from the AI response");
}

function slugify(label: string): string {
  const slug = label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "field";
}

/** AI-provided ids may be missing, malformed, or duplicated. Normalize them deterministically. */
function normalizeFieldIds(fields: GeneratedField[]): GeneratedField[] {
  const seen = new Map<string, number>();
  return fields.map((field) => {
    const base = slugify(field.id || field.label);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}_${count + 1}`;
    return { ...field, id };
  });
}

function sanitizeString(value: string): string {
  // Strip control characters; template rendering (React) already escapes
  // HTML, but we keep persisted/display strings free of stray control bytes.
  return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim();
}

/**
 * Validates and normalizes a raw AI JSON payload into a trustworthy
 * GeneratedForm. Never trust AI output directly — this is the single choke
 * point every AI response must pass through before reaching storage or the
 * frontend.
 */
export function validateGeneratedForm(rawJson: unknown): GeneratedForm {
  const parsed = GeneratedFormSchema.safeParse(rawJson);
  if (!parsed.success) {
    throw new InvalidAIResponseError(`AI response failed schema validation: ${parsed.error.message}`);
  }

  const form = parsed.data;

  if (form.status === "no_form_detected") {
    return { ...form, title: null, description: null, detectedLanguage: null, fields: [] };
  }

  const sanitizedFields = form.fields.map((field) => ({
    ...field,
    label: sanitizeString(field.label),
    placeholder: field.placeholder ? sanitizeString(field.placeholder) : field.placeholder,
    options: field.options?.map(sanitizeString)
  }));

  const normalizedFields = normalizeFieldIds(sanitizedFields);

  if (normalizedFields.length === 0) {
    return {
      status: "no_form_detected",
      title: null,
      description: null,
      detectedLanguage: null,
      fields: []
    };
  }

  return {
    ...form,
    title: form.title ? sanitizeString(form.title) : form.title,
    description: form.description ? sanitizeString(form.description) : form.description,
    fields: normalizedFields
  };
}

/** Convenience: raw text straight from the AI provider -> validated form. */
export function parseAndValidateAIResponse(rawText: string): GeneratedForm {
  const json = extractJson(rawText);
  return validateGeneratedForm(json);
}

function isEmptyValue(value: unknown): boolean {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

/**
 * Server-side defense in depth for submitted form values: required fields
 * must be present, and each value must match its declared field type. The
 * client already validates for UX, but the server never trusts it.
 */
export function validateSubmissionValues(
  fields: GeneratedField[],
  raw: Record<string, unknown>
): Record<string, unknown> {
  const errors: Record<string, string> = {};
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const value = raw[field.id];

    if (field.required && isEmptyValue(value)) {
      errors[field.id] = "This field is required.";
      continue;
    }

    if (isEmptyValue(value)) {
      result[field.id] = field.type === "checkbox-group" ? [] : null;
      continue;
    }

    switch (field.type) {
      case "number": {
        const num = typeof value === "number" ? value : Number(value);
        if (!Number.isFinite(num)) {
          errors[field.id] = "Please enter a valid number.";
          break;
        }
        result[field.id] = num;
        break;
      }
      case "email": {
        const str = String(value);
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
          errors[field.id] = "Please enter a valid email address.";
          break;
        }
        result[field.id] = str.slice(0, 200);
        break;
      }
      case "boolean": {
        const bool = value === true || value === "true" || value === "yes" ? true : value === false || value === "false" || value === "no" ? false : null;
        if (bool === null) {
          errors[field.id] = "Please choose Yes or No.";
          break;
        }
        result[field.id] = bool;
        break;
      }
      case "select": {
        const str = String(value);
        if (field.options && !field.options.includes(str)) {
          errors[field.id] = "Please choose a valid option.";
          break;
        }
        result[field.id] = str;
        break;
      }
      case "checkbox-group": {
        const arr = Array.isArray(value) ? value.map(String) : [];
        if (field.options && arr.some((v) => !field.options!.includes(v))) {
          errors[field.id] = "Please choose valid options.";
          break;
        }
        result[field.id] = arr;
        break;
      }
      case "date": {
        const str = String(value);
        if (Number.isNaN(Date.parse(str))) {
          errors[field.id] = "Please enter a valid date.";
          break;
        }
        result[field.id] = str;
        break;
      }
      default: {
        result[field.id] = sanitizeString(String(value)).slice(0, 5000);
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new SubmissionValidationError(errors);
  }

  return result;
}
