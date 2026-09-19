import type { ApiErrorCode, GeneratedForm, StoredForm, Submission } from "@shared/schema";

export class ApiClientError extends Error {
  code: ApiErrorCode;
  fieldErrors?: Record<string, string>;
  constructor(code: ApiErrorCode, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) return (await res.json()) as T;

  let body: { error?: { code: ApiErrorCode; message: string }; fieldErrors?: Record<string, string> } = {};
  try {
    body = await res.json();
  } catch {
    // non-JSON error body (e.g. proxy/network failure)
  }

  const code = body.error?.code ?? "INTERNAL_ERROR";
  const message = body.error?.message ?? "Something went wrong. Please try again.";
  throw new ApiClientError(code, message, body.fieldErrors);
}

export async function getConfig(): Promise<{ aiConfigured: boolean }> {
  const res = await fetch("/api/config");
  return handleResponse(res);
}

export interface AnalyzeResponse {
  form: (GeneratedForm & { id: string | null; source: "ai"; createdAt: string }) | StoredForm;
}

export async function analyzeImage(file: File, signal?: AbortSignal): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/analyze", { method: "POST", body: formData, signal });
  return handleResponse(res);
}

export interface DemoScenarioSummary {
  id: string;
  title: string | null;
  description: string | null;
}

export async function listDemoScenarios(): Promise<{ scenarios: DemoScenarioSummary[] }> {
  const res = await fetch("/api/demo");
  return handleResponse(res);
}

export async function startDemo(scenarioId: string): Promise<{ form: StoredForm; paperLines: string[] }> {
  const res = await fetch(`/api/demo/${scenarioId}`, { method: "POST" });
  return handleResponse(res);
}

export async function getForm(id: string): Promise<{ form: StoredForm; paperLines: string[] | null }> {
  const res = await fetch(`/api/forms/${id}`);
  return handleResponse(res);
}

export async function listForms(): Promise<{ forms: StoredForm[] }> {
  const res = await fetch(`/api/forms`);
  return handleResponse(res);
}

export async function submitForm(
  formId: string,
  values: Record<string, unknown>
): Promise<{ submission: Submission }> {
  const res = await fetch(`/api/forms/${formId}/submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values })
  });
  return handleResponse(res);
}

export async function listSubmissions(formId: string): Promise<{ submissions: Submission[] }> {
  const res = await fetch(`/api/forms/${formId}/submissions`);
  return handleResponse(res);
}
