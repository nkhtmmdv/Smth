import { useLanguage } from "../../i18n";
import type { FieldComponentProps } from "./types";

export function BooleanField({ value, onChange, error, inputId }: FieldComponentProps) {
  const { t } = useLanguage();
  const options: { value: boolean; label: string }[] = [
    { value: true, label: t.yes },
    { value: false, label: t.no }
  ];

  return (
    <div id={inputId} role="group" className="flex gap-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={selected}
            className={`flex-1 rounded-xl border px-4 py-2.5 text-[15px] font-medium transition-all ${
              selected
                ? "border-brand-500 bg-brand-500 text-white shadow-soft"
                : `bg-white text-ink-700 ${error ? "border-red-400" : "border-ink-200 hover:border-ink-300"}`
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
