import { Router } from "express";
import { nanoid } from "nanoid";
import { imageUpload } from "../middleware/upload.js";
import { asyncHandler, ApiError } from "../middleware/errors.js";
import { analyzeDocumentImage, isAIConfigured } from "../services/ai.js";
import { parseAndValidateAIResponse } from "../services/formValidation.js";
import { saveForm } from "../services/store.js";

export const analyzeRouter = Router();

analyzeRouter.post(
  "/",
  imageUpload.single("image"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError("VALIDATION_ERROR", 400, "No image was uploaded.");
    }
    if (!isAIConfigured()) {
      throw new ApiError(
        "AI_UNAVAILABLE",
        503,
        "AI analysis is temporarily unavailable. Try again or use Demo Mode."
      );
    }

    const base64 = req.file.buffer.toString("base64");
    const rawText = await analyzeDocumentImage(base64, req.file.mimetype);
    const form = parseAndValidateAIResponse(rawText);

    if (form.status === "no_form_detected") {
      res.json({ form: { ...form, id: null, source: "ai" as const, createdAt: new Date().toISOString() } });
      return;
    }

    const id = nanoid(10);
    const stored = saveForm(id, form, "ai");
    res.json({ form: stored });
  })
);
