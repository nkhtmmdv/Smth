import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { StoredForm } from "@shared/schema";
import { useLanguage } from "../i18n";
import { PaperPreview } from "./PaperPreview";
import { DynamicForm } from "./DynamicForm";
import { submitForm, ApiClientError } from "../lib/api";

interface FormReadyScreenProps {
  form: StoredForm;
  imageUrl?: string | null;
  paperLines?: string[] | null;
  onSubmitted: () => void;
  onUploadAnother: () => void;
  onViewSubmissions: () => void;
}

export function FormReadyScreen({
  form,
  imageUrl,
  paperLines,
  onSubmitted,
  onUploadAnother,
  onViewSubmissions
}: FormReadyScreenProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!form.id) return;
    setSubmitting(true);
    setSubmitError(null);
    setFieldErrors({});
    try {
      await submitForm(form.id, values);
      setSaved(true);
      onSubmitted();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setSubmitError(err.message);
        if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const languageLabel = form.detectedLanguage ? form.detectedLanguage.toUpperCase() : null;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="animate-fade-up text-center">
        <h2 className="text-2xl font-bold text-ink-950 sm:text-3xl">{t.formReadyTitle}</h2>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-ink-500">
          <span className="rounded-full bg-ink-100 px-3 py-1 font-medium">{t.fieldsDetected(form.fields.length)}</span>
          {languageLabel && (
            <span className="rounded-full bg-ink-100 px-3 py-1 font-medium">
              {t.languageDetected}: {languageLabel}
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="animate-fade-up">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">{t.originalLabel}</p>
          <div className="overflow-hidden rounded-2xl border border-ink-200 shadow-soft">
            {imageUrl ? (
              <img src={imageUrl} className="block max-h-[520px] w-full object-cover" alt="Original document" />
            ) : (
              <PaperPreview lines={paperLines ?? []} />
            )}
          </div>
        </div>

        <div className="animate-fade-up">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-400">{t.digitalLabel}</p>
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
            {form.title && <h3 className="mb-1 text-lg font-bold text-ink-950">{form.title}</h3>}
            {form.description && <p className="mb-5 text-sm text-ink-500">{form.description}</p>}

            {saved ? (
              <div className="flex animate-pop-in flex-col items-center gap-4 py-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={30} />
                </span>
                <p className="text-lg font-semibold text-ink-900">{t.submissionSaved}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={onViewSubmissions}
                    className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                  >
                    {t.viewSubmissions}
                  </button>
                  <button
                    onClick={onUploadAnother}
                    className="rounded-xl border border-ink-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                  >
                    {t.uploadAnother}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <DynamicForm
                  fields={form.fields}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  externalFieldErrors={fieldErrors}
                />
                {submitError && <p className="mt-3 text-sm font-medium text-red-500">{submitError}</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
