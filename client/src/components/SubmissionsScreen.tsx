import { useEffect, useState } from "react";
import { ChevronDown, ArrowLeft } from "lucide-react";
import type { GeneratedField, StoredForm, Submission } from "@shared/schema";
import { useLanguage, type Language } from "../i18n";
import { listSubmissions } from "../lib/api";

interface SubmissionsScreenProps {
  form: StoredForm;
  onBack: () => void;
}

const LOCALES: Record<Language, string> = { en: "en-US", ru: "ru-RU", az: "az-AZ" };

function formatValue(field: GeneratedField, value: unknown, t: ReturnType<typeof useLanguage>["t"]): string {
  if (value === null || value === undefined || value === "") return "—";
  if (field.type === "boolean") return value ? t.yes : t.no;
  if (field.type === "checkbox-group" && Array.isArray(value)) return value.join(", ") || "—";
  return String(value);
}

export function SubmissionsScreen({ form, onBack }: SubmissionsScreenProps) {
  const { t, language } = useLanguage();
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!form.id) return;
    listSubmissions(form.id)
      .then((res) => setSubmissions(res.submissions))
      .catch(() => setSubmissions([]));
  }, [form.id]);

  const previewFields = form.fields.slice(0, 3);
  const formatter = new Intl.DateTimeFormat(LOCALES[language], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <button onClick={onBack} className="mb-6 flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800">
        <ArrowLeft size={15} />
        {t.backToForm}
      </button>

      <h2 className="text-xl font-bold text-ink-950">{t.submissionsTitle}</h2>
      {form.title && <p className="mt-1 text-sm text-ink-500">{form.title}</p>}

      <div className="mt-6 flex flex-col gap-3">
        {submissions === null && <p className="text-sm text-ink-400">…</p>}

        {submissions !== null && submissions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-10 text-center text-sm text-ink-400">
            {t.submissionsEmpty}
          </div>
        )}

        {submissions?.map((submission, idx) => {
          const expanded = expandedId === submission.id;
          const fieldsToShow = expanded ? form.fields : previewFields;
          return (
            <div key={submission.id} className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-soft">
              <button
                onClick={() => setExpandedId(expanded ? null : submission.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <p className="text-sm font-bold text-ink-900">{t.submissionNumber(submissions.length - idx)}</p>
                  <p className="mt-0.5 text-xs text-ink-400">{formatter.format(new Date(submission.createdAt))}</p>
                </div>
                <ChevronDown size={18} className={`text-ink-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-ink-100 px-5 py-4 sm:grid-cols-3">
                {fieldsToShow.map((field) => (
                  <div key={field.id}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{field.label}</p>
                    <p className="mt-0.5 truncate text-sm font-medium text-ink-800">
                      {formatValue(field, submission.values[field.id], t)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
