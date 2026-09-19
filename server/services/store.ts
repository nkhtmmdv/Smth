import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { GeneratedForm, StoredForm, Submission } from "../../shared/schema.js";

/**
 * Minimal persistence: generated form schemas + their submissions. Nothing
 * more — no ORM, no migrations framework. node:sqlite is built into Node 22+
 * so this needs zero native dependencies (a common source of pain in
 * sandboxed / Replit environments).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, "snap2form.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS forms (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    detectedLanguage TEXT,
    status TEXT NOT NULL,
    fieldsJson TEXT NOT NULL,
    source TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    formId TEXT NOT NULL,
    valuesJson TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (formId) REFERENCES forms(id)
  );
`);

function rowToForm(row: Record<string, unknown>): StoredForm {
  return {
    id: row.id as string,
    title: row.title as string | null,
    description: (row.description as string | null) ?? null,
    detectedLanguage: row.detectedLanguage as string | null,
    status: row.status as "success" | "no_form_detected",
    fields: JSON.parse(row.fieldsJson as string),
    source: row.source as "ai" | "demo",
    createdAt: row.createdAt as string
  };
}

function rowToSubmission(row: Record<string, unknown>): Submission {
  return {
    id: row.id as string,
    formId: row.formId as string,
    createdAt: row.createdAt as string,
    values: JSON.parse(row.valuesJson as string)
  };
}

export function saveForm(id: string, form: GeneratedForm, source: "ai" | "demo"): StoredForm {
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO forms (id, title, description, detectedLanguage, status, fieldsJson, source, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  stmt.run(
    id,
    form.title,
    form.description ?? null,
    form.detectedLanguage,
    form.status,
    JSON.stringify(form.fields),
    source,
    createdAt
  );
  return { ...form, id, source, createdAt };
}

export function getForm(id: string): StoredForm | null {
  const row = db.prepare(`SELECT * FROM forms WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  return row ? rowToForm(row) : null;
}

export function listForms(): StoredForm[] {
  const rows = db.prepare(`SELECT * FROM forms ORDER BY createdAt DESC`).all() as Record<string, unknown>[];
  return rows.map(rowToForm);
}

export function saveSubmission(id: string, formId: string, values: Record<string, unknown>): Submission {
  const createdAt = new Date().toISOString();
  db.prepare(`INSERT INTO submissions (id, formId, valuesJson, createdAt) VALUES (?, ?, ?, ?)`).run(
    id,
    formId,
    JSON.stringify(values),
    createdAt
  );
  return { id, formId, createdAt, values };
}

export function listSubmissions(formId: string): Submission[] {
  const rows = db
    .prepare(`SELECT * FROM submissions WHERE formId = ? ORDER BY createdAt DESC`)
    .all(formId) as Record<string, unknown>[];
  return rows.map(rowToSubmission);
}

export function getSubmission(id: string): Submission | null {
  const row = db.prepare(`SELECT * FROM submissions WHERE id = ?`).get(id) as Record<string, unknown> | undefined;
  return row ? rowToSubmission(row) : null;
}

/**
 * Demo scenarios carry a small text mockup of the "original paper" for the
 * client to render (see server/services/demoData.ts). It isn't part of the
 * form schema, so it's kept in a lightweight in-memory side table rather
 * than migrating the forms table for a hackathon-only convenience field.
 */
const demoPaperLines = new Map<string, string[]>();

export function savePaperLines(formId: string, lines: string[]): void {
  demoPaperLines.set(formId, lines);
}

export function getPaperLines(formId: string): string[] | null {
  return demoPaperLines.get(formId) ?? null;
}
