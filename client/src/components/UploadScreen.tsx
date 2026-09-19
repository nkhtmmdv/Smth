import { useRef, useState } from "react";
import { UploadCloud, ImagePlus, ScanEye, LayoutGrid, Sparkles } from "lucide-react";
import { useLanguage } from "../i18n";
import { validateImageFile, type FileValidationError } from "../lib/fileUtils";

export interface MyFormEntry {
  id: string;
  title: string | null;
}

interface UploadScreenProps {
  onFileSelected: (file: File) => void;
  onOpenDemoPicker: () => void;
  aiConfigured: boolean | null;
  myForms?: MyFormEntry[];
  onOpenMyForm?: (id: string) => void;
}

export function UploadScreen({ onFileSelected, onOpenDemoPicker, aiConfigured, myForms, onOpenMyForm }: UploadScreenProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<FileValidationError | null>(null);

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError(null);
    onFileSelected(file);
  };

  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-14 sm:px-8 sm:pt-20">
      <div className="animate-fade-up text-center">
        <div className="mb-5 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <Sparkles size={12} />
            {t.heroTagline}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink-950 sm:text-5xl">{t.heroTitle}</h1>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-ink-500">{t.heroSubtitle}</p>
      </div>

      {aiConfigured === false && (
        <div className="mx-auto mt-8 max-w-xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-800">
          {t.aiNotConfiguredBanner}
        </div>
      )}

      <div className="mx-auto mt-10 max-w-2xl">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`animate-pop-in rounded-3xl border-2 border-dashed bg-white px-8 py-14 text-center shadow-soft transition-colors ${
            dragActive ? "border-brand-500 bg-brand-50" : "border-ink-200"
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <UploadCloud size={26} />
          </div>
          <p className="mt-4 text-base font-semibold text-ink-800">{t.dragDropTitle}</p>
          <p className="mt-1 text-sm text-ink-400">{t.dragDropOr}</p>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-[15px] font-semibold text-white shadow-soft transition-colors hover:bg-brand-600"
            >
              <ImagePlus size={17} />
              {t.uploadCta}
            </button>
            <button
              onClick={onOpenDemoPicker}
              className="inline-flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-6 py-3 text-[15px] font-semibold text-ink-700 transition-colors hover:border-ink-300 hover:bg-ink-50"
            >
              {t.tryDemoCta}
            </button>
          </div>

          <p className="mt-4 text-xs text-ink-400">{t.formatsNote}</p>
          {fileError && (
            <p className="mt-2 text-sm font-medium text-red-500">
              {fileError === "UNSUPPORTED_FILE_TYPE" ? t.errorUnsupportedFileType : t.errorFileTooLarge}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
        {[
          { icon: ImagePlus, title: t.step1Title, desc: t.step1Desc },
          { icon: ScanEye, title: t.step2Title, desc: t.step2Desc },
          { icon: LayoutGrid, title: t.step3Title, desc: t.step3Desc }
        ].map((step, i) => (
          <div key={i} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50 text-ink-600">
              <step.icon size={18} />
            </div>
            <p className="text-sm font-semibold text-ink-800">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-500">{step.desc}</p>
          </div>
        ))}
      </div>

      {myForms && myForms.length > 0 && (
        <div className="mx-auto mt-12 max-w-2xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-ink-400">{t.navMyForms}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {myForms.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onOpenMyForm?.(entry.id)}
                className="rounded-full border border-ink-200 bg-white px-4 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {entry.title ?? entry.id}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mx-auto mt-14 max-w-xl text-center text-sm font-medium text-ink-400">{t.secondaryMessage}</p>
    </div>
  );
}
