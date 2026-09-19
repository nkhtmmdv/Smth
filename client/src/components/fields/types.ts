import type { GeneratedField } from "@shared/schema";

export interface FieldComponentProps {
  field: GeneratedField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  inputId: string;
}

export const baseInputClass =
  "w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500";

export function inputBorderClass(hasError: boolean): string {
  return hasError ? "border-red-400" : "border-ink-200 hover:border-ink-300";
}
