import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useLanguage } from "../i18n";
import { PaperPreview } from "./PaperPreview";

const STAGE_KEYS = ["stageReading", "stageStructure", "stageFields", "stageTypes", "stageBuilding"] as const;
const STAGE_INTERVAL_MS = 850;

interface AnalysisScreenProps {
  imageUrl?: string | null;
  paperLines?: string[] | null;
}

/**
 * Indeterminate progress by design — no fake exact percentages. The stage
 * list advances on its own timer regardless of real network latency; App.tsx
 * enforces a minimum display time so this never flashes by too fast, and
 * simply keeps cycling if the real request takes longer.
 */
export function AnalysisScreen({ imageUrl, paperLines }: AnalysisScreenProps) {
  const { t } = useLanguage();
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= STAGE_KEYS.length - 1) return;
    const timer = setTimeout(() => setStageIndex((i) => i + 1), STAGE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [stageIndex]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <h2 className="animate-fade-up text-center text-2xl font-bold text-ink-950">{t.analysisTitle}</h2>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:items-center">
        <div className="relative overflow-hidden rounded-2xl border border-ink-200 shadow-soft">
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded document" className="block max-h-[420px] w-full object-cover" />
          ) : (
            <PaperPreview lines={paperLines ?? []} />
          )}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-0 right-0 h-1 animate-scan bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_24px_6px_rgba(52,102,246,0.55)]" />
          </div>
        </div>

        <ul className="flex flex-col gap-2.5">
          {STAGE_KEYS.map((key, i) => {
            const done = i < stageIndex;
            const active = i === stageIndex;
            return (
              <li
                key={key}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300 ${
                  active
                    ? "border-brand-300 bg-brand-50"
                    : done
                      ? "border-ink-100 bg-white"
                      : "border-ink-100 bg-ink-50/60 opacity-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? "bg-emerald-500 text-white" : active ? "bg-brand-500 text-white" : "bg-ink-200 text-ink-500"
                  }`}
                >
                  {done ? <Check size={14} /> : i + 1}
                </span>
                <span className={`text-sm font-medium ${active ? "text-brand-700" : "text-ink-600"}`}>{t[key]}</span>
                {active && <Loader2 className="ml-auto animate-spin text-brand-400" size={16} />}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
