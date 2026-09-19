import { FileStack, Layers } from "lucide-react";
import { LANGUAGES, useLanguage } from "../i18n";

interface NavProps {
  onLogoClick: () => void;
  onSubmissionsClick?: () => void;
  onFormClick?: () => void;
  showFormNav?: boolean;
  activeTab?: "form" | "submissions";
}

export function Nav({ onLogoClick, onSubmissionsClick, onFormClick, showFormNav, activeTab }: NavProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <button onClick={onLogoClick} className="flex items-center gap-2 text-ink-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
            <Layers size={17} strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">{t.brand}</span>
        </button>

        <div className="flex items-center gap-5">
          {showFormNav && (
            <div className="hidden items-center gap-1 rounded-lg bg-ink-50 p-1 sm:flex">
              <button
                onClick={onFormClick}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "form" ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-700"
                }`}
              >
                <FileStack size={14} />
                {t.navForm}
              </button>
              <button
                onClick={onSubmissionsClick}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "submissions" ? "bg-white text-ink-900 shadow-soft" : "text-ink-500 hover:text-ink-700"
                }`}
              >
                <Layers size={14} />
                {t.navSubmissions}
              </button>
            </div>
          )}

          <div className="flex items-center gap-0.5 rounded-lg border border-ink-200 p-0.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                  language === lang.code ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-800"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
