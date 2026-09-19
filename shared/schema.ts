import { z } from "zod";

/**
 * Shared contract between the AI layer, server validation, storage, and the
 * client's dynamic form renderer. Nothing downstream should ever trust raw
 * AI output directly — it must pass through GeneratedFormSchema first.
 */

export const FIELD_TYPES = [
  "text",
  "number",
  "textarea",
  "boolean",
  "select",
  "checkbox-group",
  "date",
  "email",
  "phone"
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

const OPTIONS_TYPES: FieldType[] = ["select", "checkbox-group"];

export const GeneratedFieldSchema = z
  .object({
    id: z.string().min(1).max(80),
    label: z.string().min(1).max(200),
    type: z.enum(FIELD_TYPES),
    required: z.boolean().default(false),
    placeholder: z.string().max(200).optional().nullable(),
    options: z.array(z.string().min(1).max(120)).max(20).optional().nullable()
  })
  .superRefine((field, ctx) => {
    if (OPTIONS_TYPES.includes(field.type)) {
      if (!field.options || field.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Field "${field.id}" of type "${field.type}" requires at least 2 options`,
          path: ["options"]
        });
      }
    }
  });

export type GeneratedField = z.infer<typeof GeneratedFieldSchema>;

export const GeneratedFormSchema = z.object({
  status: z.enum(["success", "no_form_detected"]),
  title: z.string().min(1).max(200).nullable(),
  description: z.string().max(500).nullable().optional(),
  detectedLanguage: z.string().max(20).nullable(),
  fields: z.array(GeneratedFieldSchema).max(40)
});

export type GeneratedForm = z.infer<typeof GeneratedFormSchema>;

/** A form persisted server-side, with a stable id and creation time. */
export const StoredFormSchema = GeneratedFormSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  source: z.enum(["ai", "demo"])
});
export type StoredForm = z.infer<typeof StoredFormSchema>;

export const SubmissionSchema = z.object({
  id: z.string(),
  formId: z.string(),
  createdAt: z.string(),
  values: z.record(z.string(), z.unknown())
});
export type Submission = z.infer<typeof SubmissionSchema>;

/** Error codes the client maps to specific, friendly copy. */
export const API_ERROR_CODES = [
  "UNSUPPORTED_FILE_TYPE",
  "FILE_TOO_LARGE",
  "AI_UNAVAILABLE",
  "AI_TIMEOUT",
  "INVALID_AI_RESPONSE",
  "NO_FORM_DETECTED",
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "INTERNAL_ERROR"
] as const;
export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
  };
}
