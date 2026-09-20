import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeRouter } from "./routes/analyze.js";
import { demoRouter } from "./routes/demo.js";
import { formsRouter } from "./routes/forms.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { isAIConfigured } from "./services/ai.js";

try {
  process.loadEnvFile();
} catch {
  // no .env file present — fine, env vars may be supplied another way
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/api/config", (_req, res) => {
  res.json({ aiConfigured: isAIConfigured() });
});

app.use("/api/analyze", analyzeRouter);
app.use("/api/demo", demoRouter);
app.use("/api/forms", formsRouter);

if (process.env.NODE_ENV === "production") {
  const clientDist = path.resolve(__dirname, "../dist/client");
  app.use(express.static(clientDist));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Snap2Form AI server listening on port ${port}`);
  console.log(`AI configured: ${isAIConfigured()}`);
  if (!isAIConfigured()) {
    console.warn(
      "No AI provider configured. Set GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY to enable live document analysis (Demo Mode still works)."
    );
  }
});
