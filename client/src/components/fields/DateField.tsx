import { baseInputClass, inputBorderClass, type FieldComponentProps } from "./types";

export function DateField({ value, onChange, error, inputId }: FieldComponentProps) {
  return (
    <input
      id={inputId}
      type="date"
      className={`${baseInputClass} ${inputBorderClass(Boolean(error))}`}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
    />
  );
}
