# Snap2Form AI

Turn paper into software. Upload a photo of any paper form, checklist, or
registration sheet and Snap2Form AI turns it into a real, working, submittable
digital form in seconds — not a screenshot, not a static mockup.

> One photo. One AI analysis. One working digital form.

## How it works

```
IMAGE
  ↓
MULTIMODAL VISION AI        (server/services/ai.ts)
  ↓
STRUCTURED JSON SCHEMA       (raw model output)
  ↓
SCHEMA VALIDATION            (server/services/formValidation.ts, shared/schema.ts)
  ↓
DYNAMIC FORM RENDERER        (client/src/components/DynamicForm.tsx + FieldRenderer.tsx)
  ↓
INTERACTIVE FORM
  ↓
SUBMIT
  ↓
SAVED SUBMISSION             (SQLite via server/services/store.ts)
```

The AI never generates code and nothing it returns is ever executed. It only
returns a JSON description of a form (title, fields, types, options). The
frontend has **one universal renderer** that turns that JSON into a real,
interactive form — every AI-generated or demo form flows through the exact
same `DynamicForm` / `FieldRenderer` components in
`client/src/components/`. Nothing is hardcoded per-document.

Supported field types: `text`, `number`, `textarea`, `boolean`, `select`,
`checkbox-group`, `date`, `email`, `phone`.

### Provider abstraction

`server/services/ai.ts` is the only file that talks to an AI provider. It
supports **OpenAI** (`gpt-4o-mini`, vision) and **Anthropic** (`claude-3-5-sonnet`,
vision) behind one interface, chosen automatically by whichever API key is
present in the environment (OpenAI checked first). Swapping or adding a
provider means editing only that file — routes, storage, and the frontend
never depend on a specific provider.

API keys are read only server-side from environment variables and are never
sent to or exposed in the frontend bundle.

### Validation, never trust the model

Raw AI output is untrusted text. `server/services/formValidation.ts`:

1. Safely extracts JSON even if the model wraps it in markdown fences or prose
   (never uses `eval`).
2. Validates it against `GeneratedFormSchema` (Zod, in `shared/schema.ts`) —
   unknown field types are rejected, `select`/`checkbox-group` fields must
   have ≥2 options, strings are sanitized.
3. Normalizes field ids (e.g. `"Customer Name"` → `customer_name`) and
   de-duplicates them deterministically.

Submitted form values go through a second, independent server-side validation
pass (`validateSubmissionValues`) — required fields and per-type checks
(valid email, valid number, valid date, value is one of the declared
options, etc.) are enforced again on the server, never trusting the client.

### Storage

SQLite via Node's built-in `node:sqlite` (no native dependency to compile —
works out of the box on Node 22+, including in sandboxed environments and on
Replit). The database file lives at `server/data/snap2form.db` (git-ignored).
It stores generated form schemas and their submissions only. Uploaded photos
are processed in memory and are **not** persisted to disk.

### Demo Mode

"Try Demo" never calls the AI provider. It uses three bundled scenarios
(Warehouse Delivery, Repair Request, Kitchen Opening Checklist) defined in
`server/services/demoData.ts`, served instantly, so the live demo survives
flaky internet, a slow/rate-limited AI provider, or a bad photo. Demo forms
still go through the exact same validation, storage, dynamic renderer, and
submission flow as a real AI-analyzed form.

## Project structure

```
shared/schema.ts             Zod schemas shared by server + client (the contract)
server/
  index.ts                   Express app, static serving in production
  services/ai.ts             AI provider abstraction + system prompt
  services/formValidation.ts JSON extraction, schema validation, id normalization
  services/store.ts          SQLite persistence (node:sqlite)
  services/demoData.ts       Bundled demo scenarios
  routes/                    /api/analyze, /api/demo, /api/forms
  middleware/                multer upload validation, centralized error handling
client/
  src/App.tsx                Screen state machine (upload → analyzing → ready → submissions)
  src/components/
    DynamicForm.tsx          Universal form renderer
    FieldRenderer.tsx        Maps field.type -> field component
    fields/                  One component per supported field type
    UploadScreen.tsx         Landing page + drag-and-drop upload
    AnalysisScreen.tsx       Scanner animation + stage progression
    FormReadyScreen.tsx      Side-by-side Original / Digital Version + submit
    SubmissionsScreen.tsx    List + expand saved submissions
  src/i18n/                  AZ / RU / EN translations
```

## Setup

```bash
npm install
cp .env.example .env   # then fill in an API key (see below)
npm run dev            # runs the Express API (port 3000) + Vite dev server (port 5173, proxies /api)
```

Open http://localhost:5173 during development.

### Environment variables

Set **one** of these in `.env` (or your platform's Secrets manager) to enable
live AI analysis:

```
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

Without either key set, the app still starts and runs completely — real photo
uploads will show a friendly "AI analysis is temporarily unavailable, try
Demo Mode" message, and **Demo Mode works fully** regardless.

`PORT` is optional (defaults to `3000`; Replit sets this automatically).

### Build & run in production

```bash
npm run build     # builds the client into dist/client
npm start          # NODE_ENV=production, serves the built client + API on one port
```

### Type checking

```bash
npm run typecheck
```

## Deploying on Replit

1. Import this repository into Replit.
2. In the Secrets tab, add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`.
3. Set the run command to:
   ```
   npm install && npm run build && npm start
   ```
4. The server binds to `0.0.0.0` and reads `process.env.PORT`, so Replit's
   port forwarding works without extra configuration.

## What was tested

- Warehouse Delivery, Repair Request, and Kitchen Checklist demo scenarios,
  full flow: pick demo → scanning animation → side-by-side original/digital
  form → fill in every field type (text, number, date, boolean, select,
  textarea, phone) → submit → "Submission saved" → submissions list.
- Required-field inline validation (submitting an empty form shows "This
  field is required." next to each missing field and blocks submission).
- Server-side submission validation independent of the client (curl tests
  against `/api/forms/:id/submissions`).
- Malformed / non-JSON / markdown-fenced AI output handled safely without
  crashing (`server/services/formValidation.ts` smoke tests).
- Schema rejects unknown field types and `select`/`checkbox-group` fields
  with fewer than 2 options.
- Duplicate field id normalization (`"Full Name"` appearing twice → `full_name`,
  `full_name_2`).
- Unsupported file type and file-too-large error responses.
- Real photo upload path with no AI key configured → friendly "AI
  unavailable, try Demo Mode" screen (verified in a real browser).
- AZ / RU / EN language switching across the landing page.
- `npm run typecheck` (client + server) and `npm run build` both pass cleanly.

## Known limitations

- **Live AI analysis requires an API key.** No `OPENAI_API_KEY` or
  `ANTHROPIC_API_KEY` was available in this environment, so the real
  vision-analysis path (photo → AI → schema) could not be exercised against
  a live model — it was verified structurally (provider abstraction, prompt,
  timeout/error handling) and through the JSON-validation pipeline directly.
  Demo Mode fully covers the interactive-form experience without a key.
- Original uploaded photos are not persisted (by design, per spec) — if you
  reopen a previously AI-generated form later in the same browser via "My
  Forms," the side-by-side view falls back to a placeholder in place of the
  original photo (demo forms always show their paper mockup, since that is
  bundled).
- "My Forms" and multi-form history are session/browser-local
  (`localStorage`), not tied to any account, per the "no auth" requirement.
