import type { FieldComponentProps } from "./types";

export function CheckboxGroupField({ field, value, onChange, error, inputId }: FieldComponentProps) {
  const selected = Array.isArray(value) ? (value as string[]) : [];
  const options = field.options ?? [];

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div id={inputId} role="group" className="flex flex-wrap gap-2">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            role="checkbox"
            aria-checked={checked}
            onClick={() => toggle(option)}
            className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
              checked
                ? "border-brand-500 bg-brand-50 text-brand-700"
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
