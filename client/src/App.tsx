import { useEffect, useState } from "react";
import type { StoredForm } from "@shared/schema";
import { Nav } from "./components/Nav";
import { UploadScreen, type MyFormEntry } from "./components/UploadScreen";
import { DemoPicker } from "./components/DemoPicker";
import { AnalysisScreen } from "./components/AnalysisScreen";
import { FormReadyScreen } from "./components/FormReadyScreen";
import { SubmissionsScreen } from "./components/SubmissionsScreen";
import { ErrorScreen } from "./components/ErrorScreen";
import { useLanguage } from "./i18n";
import { analyzeImage, startDemo, getForm, getConfig, ApiClientError } from "./lib/api";
import { compressImageIfNeeded } from "./lib/fileUtils";
import { DEMO_SCENARIO_PREVIEWS } from "./lib/demoScenarios";

type Screen = "upload" | "analyzing" | "ready" | "submissions" | "error";

interface ErrorState {
  variant: "no-form" | "generic";
  message?: string;
}

const MIN_ANALYSIS_MS = 2600;
const MY_FORMS_KEY = "snap2form.myForms";

function withMinDelay<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.all([promise, new Promise<void>((resolve) => setTimeout(resolve, ms))]).then(([result]) => result);
}

function loadMyForms(): MyFormEntry[] {
  try {
    const raw = window.localStorage.getItem(MY_FORMS_KEY);
    return raw ? (JSON.parse(raw) as MyFormEntry[]) : [];
  } catch {
    return [];
  }
}

function rememberForm(entry: MyFormEntry): MyFormEntry[] {
  const next = [entry, ...loadMyForms().filter((f) => f.id !== entry.id)].slice(0, 8);
  try {
    window.localStorage.setItem(MY_FORMS_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — non-fatal, "My Forms" just won't persist
  }
  return next;
}

function errorMessageForCode(code: string, t: ReturnType<typeof useLanguage>["t"]): string {
  switch (code) {
    case "UNSUPPORTED_FILE_TYPE":
      return t.errorUnsupportedFileType;
    case "FILE_TOO_LARGE":
      return t.errorFileTooLarge;
    case "AI_UNAVAILABLE":
    case "AI_TIMEOUT":
      return t.errorAiUnavailable;
    case "INVALID_AI_RESPONSE":
      return t.errorInvalidAiResponse;
    default:
      return t.errorAiUnavailable;
  }
}

export default function App() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState<Screen>("upload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [paperLines, setPaperLines] = useState<string[] | null>(null);
  const [currentForm, setCurrentForm] = useState<StoredForm | null>(null);
  const [errorState, setErrorState] = useState<ErrorState | null>(null);
  const [demoPickerOpen, setDemoPickerOpen] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [myForms, setMyForms] = useState<MyFormEntry[]>(() => loadMyForms());

  useEffect(() => {
    getConfig()
      .then((res) => setAiConfigured(res.aiConfigured))
      .catch(() => setAiConfigured(null));
  }, []);

  const resetToUpload = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setPaperLines(null);
    setCurrentForm(null);
    setErrorState(null);
    setScreen("upload");
  };

  const handleFileSelected = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    setPaperLines(null);
    setErrorState(null);
    setScreen("analyzing");

    try {
      const processed = await compressImageIfNeeded(file);
      const { form } = await withMinDelay(analyzeImage(processed), MIN_ANALYSIS_MS);

      if (form.status === "no_form_detected") {
        setErrorState({ variant: "no-form" });
        setScreen("error");
        return;
      }

      const stored = form as StoredForm;
      setCurrentForm(stored);
      setMyForms(rememberForm({ id: stored.id, title: stored.title }));
      setScreen("ready");
    } catch (err) {
      const message = err instanceof ApiClientError ? errorMessageForCode(err.code, t) : t.errorAiUnavailable;
      setErrorState({ variant: "generic", message });
      setScreen("error");
    }
  };

  const handleSelectDemo = async (scenarioId: string) => {
    setDemoPickerOpen(false);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    const preview = DEMO_SCENARIO_PREVIEWS.find((s) => s.id === scenarioId);
    setPaperLines(preview?.paperLines ?? []);
    setErrorState(null);
    setScreen("analyzing");

    try {
      const { form } = await withMinDelay(startDemo(scenarioId), MIN_ANALYSIS_MS);
      setCurrentForm(form);
      setMyForms(rememberForm({ id: form.id, title: form.title }));
      setScreen("ready");
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : t.errorAiUnavailable;
      setErrorState({ variant: "generic", message });
      setScreen("error");
    }
  };

  const handleOpenMyForm = async (id: string) => {
    try {
      const { form, paperLines: lines } = await getForm(id);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
      setPaperLines(lines && lines.length > 0 ? lines : [form.title ?? "Document"]);
      setCurrentForm(form);
      setErrorState(null);
      setScreen("ready");
    } catch {
      // stale localStorage entry pointing at a form that no longer exists — ignore
    }
  };

  const showFormNav = screen === "ready" || screen === "submissions";

  return (
    <div className="min-h-screen">
      <Nav
        onLogoClick={resetToUpload}
        showFormNav={showFormNav}
        activeTab={screen === "ready" ? "form" : screen === "submissions" ? "submissions" : undefined}
        onFormClick={() => setScreen("ready")}
        onSubmissionsClick={() => setScreen("submissions")}
      />

      {screen === "upload" && (
        <UploadScreen
          onFileSelected={handleFileSelected}
          onOpenDemoPicker={() => setDemoPickerOpen(true)}
          aiConfigured={aiConfigured}
          myForms={myForms}
          onOpenMyForm={handleOpenMyForm}
        />
      )}

      {screen === "analyzing" && <AnalysisScreen imageUrl={imageUrl} paperLines={paperLines} />}

      {screen === "ready" && currentForm && (
        <FormReadyScreen
          form={currentForm}
          imageUrl={imageUrl}
          paperLines={paperLines}
          onSubmitted={() => {}}
          onUploadAnother={resetToUpload}
          onViewSubmissions={() => setScreen("submissions")}
        />
      )}

      {screen === "submissions" && currentForm && (
        <SubmissionsScreen form={currentForm} onBack={() => setScreen("ready")} />
      )}

      {screen === "error" && errorState && (
        <ErrorScreen
          variant={errorState.variant}
          message={errorState.message}
          onRetry={resetToUpload}
          onTryDemo={() => {
            setScreen("upload");
            setDemoPickerOpen(true);
          }}
        />
      )}

      {demoPickerOpen && <DemoPicker onClose={() => setDemoPickerOpen(false)} onSelect={handleSelectDemo} />}
    </div>
  );
}
