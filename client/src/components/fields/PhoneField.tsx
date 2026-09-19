import { baseInputClass, inputBorderClass, type FieldComponentProps } from "./types";

export function PhoneField({ field, value, onChange, error, inputId }: FieldComponentProps) {
  return (
    <input
      id={inputId}
      type="tel"
      className={`${baseInputClass} ${inputBorderClass(Boolean(error))}`}
      placeholder={field.placeholder ?? "+1 555 000 0000"}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
    />
  );
}
