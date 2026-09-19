import { baseInputClass, inputBorderClass, type FieldComponentProps } from "./types";

export function TextField({ field, value, onChange, error, inputId }: FieldComponentProps) {
  return (
    <input
      id={inputId}
      type="text"
      className={`${baseInputClass} ${inputBorderClass(Boolean(error))}`}
      placeholder={field.placeholder ?? undefined}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
    />
  );
}
