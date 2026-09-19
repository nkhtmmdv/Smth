import { baseInputClass, inputBorderClass, type FieldComponentProps } from "./types";

export function NumberField({ field, value, onChange, error, inputId }: FieldComponentProps) {
  return (
    <input
      id={inputId}
      type="number"
      inputMode="decimal"
      className={`${baseInputClass} ${inputBorderClass(Boolean(error))}`}
      placeholder={field.placeholder ?? undefined}
      value={typeof value === "number" || typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      aria-invalid={Boolean(error)}
    />
  );
}
