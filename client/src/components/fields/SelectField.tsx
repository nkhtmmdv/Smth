import { useLanguage } from "../../i18n";
import { baseInputClass, inputBorderClass, type FieldComponentProps } from "./types";

export function SelectField({ field, value, onChange, error, inputId }: FieldComponentProps) {
  const { t } = useLanguage();
  const options = field.options ?? [];

  if (options.length <= 4) {
    return (
      <div id={inputId} role="radiogroup" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                selected
                  ? "border-brand-500 bg-brand-500 text-white shadow-soft"
                  : `bg-white text-ink-700 ${error ? "border-red-400" : "border-ink-200 hover:border-ink-300"}`
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <select
      id={inputId}
      className={`${baseInputClass} ${inputBorderClass(Boolean(error))}`}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
    >
      <option value="" disabled>
        {t.selectPlaceholder}
      </option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
