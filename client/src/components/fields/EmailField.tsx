import { baseInputClass, inputBorderClass, type FieldComponentProps } from "./types";

export function EmailField({ field, value, onChange, error, inputId }: FieldComponentProps) {
  return (
    <input
      id={inputId}
      type="email"
      className={`${baseInputClass} ${inputBorderClass(Boolean(error))}`}
      placeholder={field.placeholder ?? "name@example.com"}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
    />
  );
}
