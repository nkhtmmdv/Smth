import { Router } from "express";
import { nanoid } from "nanoid";
import { asyncHandler, ApiError } from "../middleware/errors.js";
import { getForm, listForms, listSubmissions, saveSubmission, getPaperLines } from "../services/store.js";
import { validateSubmissionValues, SubmissionValidationError } from "../services/formValidation.js";

export const formsRouter = Router();

formsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json({ forms: listForms() });
  })
);

formsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const form = getForm(req.params.id);
    if (!form) throw new ApiError("NOT_FOUND", 404, "Form not found.");
    const paperLines = getPaperLines(req.params.id);
    res.json({ form, paperLines });
  })
);

formsRouter.get(
  "/:id/submissions",
  asyncHandler(async (req, res) => {
    const form = getForm(req.params.id);
    if (!form) throw new ApiError("NOT_FOUND", 404, "Form not found.");
    res.json({ submissions: listSubmissions(req.params.id) });
  })
);

formsRouter.post(
  "/:id/submissions",
  asyncHandler(async (req, res) => {
    const form = getForm(req.params.id);
    if (!form) throw new ApiError("NOT_FOUND", 404, "Form not found.");

    const rawValues = req.body?.values;
    if (!rawValues || typeof rawValues !== "object" || Array.isArray(rawValues)) {
      throw new ApiError("VALIDATION_ERROR", 400, "Missing submission values.");
    }

    try {
      const values = validateSubmissionValues(form.fields, rawValues);
      const submission = saveSubmission(nanoid(10), form.id, values);
      res.json({ submission });
    } catch (err) {
      if (err instanceof SubmissionValidationError) {
        res.status(400).json({
          error: { code: "VALIDATION_ERROR", message: "Please fix the highlighted fields." },
          fieldErrors: err.fieldErrors
        });
        return;
      }
      throw err;
    }
  })
);
