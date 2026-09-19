import { baseInputClass, inputBorderClass, type FieldComponentProps } from "./types";

export function TextareaField({ field, value, onChange, error, inputId }: FieldComponentProps) {
  return (
    <textarea
      id={inputId}
      rows={4}
      className={`${baseInputClass} ${inputBorderClass(Boolean(error))} resize-none`}
      placeholder={field.placeholder ?? undefined}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
    />
  );
}
