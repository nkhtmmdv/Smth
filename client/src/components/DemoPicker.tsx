import { useEffect, useState } from "react";
import { Warehouse, Wrench, ClipboardCheck, X } from "lucide-react";
import { useLanguage } from "../i18n";
import { listDemoScenarios, type DemoScenarioSummary } from "../lib/api";
import { DEMO_SCENARIO_PREVIEWS } from "../lib/demoScenarios";

const ICONS = { warehouse: Warehouse, wrench: Wrench, "clipboard-check": ClipboardCheck };

interface DemoPickerProps {
  onClose: () => void;
  onSelect: (scenarioId: string) => void;
}

export function DemoPicker({ onClose, onSelect }: DemoPickerProps) {
  const { t } = useLanguage();
  const [scenarios, setScenarios] = useState<DemoScenarioSummary[]>([]);

  useEffect(() => {
    listDemoScenarios()
      .then((res) => setScenarios(res.scenarios))
      .catch(() => setScenarios([]));
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-pop-in w-full max-w-2xl rounded-3xl bg-white p-6 shadow-card sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink-950">{t.demoPickerTitle}</h2>
            <p className="mt-1 text-sm text-ink-500">{t.demoPickerSubtitle}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 hover:text-ink-700">
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {DEMO_SCENARIO_PREVIEWS.map((preview) => {
            const summary = scenarios.find((s) => s.id === preview.id);
            const Icon = ICONS[preview.icon];
            return (
              <button
                key={preview.id}
                onClick={() => onSelect(preview.id)}
                className="flex flex-col items-start gap-3 rounded-2xl border border-ink-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={19} />
                </span>
                <span className="text-sm font-semibold text-ink-900">{summary?.title ?? preview.id}</span>
                <span className="text-xs leading-relaxed text-ink-500">{summary?.description}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
