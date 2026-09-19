import { Router } from "express";
import { nanoid } from "nanoid";
import { asyncHandler, ApiError } from "../middleware/errors.js";
import { DEMO_SCENARIOS, getDemoScenario } from "../services/demoData.js";
import { saveForm, savePaperLines } from "../services/store.js";

export const demoRouter = Router();

demoRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({
      scenarios: DEMO_SCENARIOS.map((s) => ({
        id: s.id,
        title: s.form.title,
        description: s.form.description
      }))
    });
  })
);

demoRouter.post(
  "/:scenarioId",
  asyncHandler(async (req, res) => {
    const scenario = getDemoScenario(req.params.scenarioId);
    if (!scenario) {
      throw new ApiError("NOT_FOUND", 404, "Unknown demo scenario.");
    }
    const id = nanoid(10);
    const stored = saveForm(id, scenario.form, "demo");
    savePaperLines(id, scenario.paperLines);
    res.json({ form: stored, paperLines: scenario.paperLines });
  })
);
