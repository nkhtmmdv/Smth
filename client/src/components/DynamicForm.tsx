import { useState } from "react";
import type { GeneratedField } from "@shared/schema";
import { FieldRenderer } from "./FieldRenderer";
import { useLanguage } from "../i18n";

interface DynamicFormProps {
  fields: GeneratedField[];
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
  submitting: boolean;
  externalFieldErrors?: Record<string, string>;
}

function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

/**
 * Universal renderer: given ANY validated field list (AI-generated or
 * demo), builds a fully interactive form. This is the component the whole
 * "paper -> software" promise depends on — nothing here is document-specific.
 */
export function DynamicForm({ fields, onSubmit, submitting, externalFieldErrors }: DynamicFormProps) {
  const { t } = useLanguage();
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setValue = (id: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && isEmpty(values[field.id])) {
        nextErrors[field.id] = t.requiredMessage;
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    await onSubmit(values);
  };

  const mergedErrors = { ...errors, ...externalFieldErrors };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {fields.map((field: GeneratedField) => (
        <FieldRenderer
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={(value) => setValue(field.id, value)}
          error={mergedErrors[field.id]}
        />
      ))}
      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full rounded-xl bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-soft transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
