import { FileQuestion, AlertTriangle } from "lucide-react";
import { useLanguage } from "../i18n";

interface ErrorScreenProps {
  variant: "no-form" | "generic";
  message?: string;
  onRetry: () => void;
  onTryDemo: () => void;
}

export function ErrorScreen({ variant, message, onRetry, onTryDemo }: ErrorScreenProps) {
  const { t } = useLanguage();
  const isNoForm = variant === "no-form";

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center sm:px-8">
      <div className="mx-auto flex h-16 w-16 animate-pop-in items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
        {isNoForm ? <FileQuestion size={30} /> : <AlertTriangle size={30} />}
      </div>
      <h2 className="mt-5 text-xl font-bold text-ink-950">{isNoForm ? t.errorNoFormTitle : message}</h2>
      {isNoForm && <p className="mt-2 text-sm leading-relaxed text-ink-500">{t.errorNoFormSubtitle}</p>}

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          onClick={onRetry}
          className="rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          {isNoForm ? t.uploadAnother : t.tryAgain}
        </button>
        <button
          onClick={onTryDemo}
          className="rounded-xl border border-ink-200 bg-white px-6 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
        >
          {t.tryDemoCta}
        </button>
      </div>
    </div>
  );
}
