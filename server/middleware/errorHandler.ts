import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { ApiError } from "./errors.js";
import { AIError } from "../services/ai.js";
import { InvalidAIResponseError } from "../services/formValidation.js";
import type { ApiErrorBody } from "../../shared/schema.js";

const AI_STATUS_BY_CODE = {
  AI_UNAVAILABLE: 503,
  AI_TIMEOUT: 504,
  INVALID_AI_RESPONSE: 502
} as const;

/** Centralized error -> HTTP response mapping. Never leaks stack traces to clients. */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ApiError) {
    const body: ApiErrorBody = { error: { code: err.code, message: err.message } };
    res.status(err.status).json(body);
    return;
  }

  if (err instanceof AIError) {
    const body: ApiErrorBody = { error: { code: err.code, message: err.message } };
    res.status(AI_STATUS_BY_CODE[err.code]).json(body);
    return;
  }

  if (err instanceof InvalidAIResponseError) {
    const body: ApiErrorBody = {
      error: {
        code: "INVALID_AI_RESPONSE",
        message: "We couldn't understand this document reliably. Please try a clearer image."
      }
    };
    res.status(502).json(body);
    return;
  }

  if (err instanceof multer.MulterError) {
    const code = err.code === "LIMIT_FILE_SIZE" ? "FILE_TOO_LARGE" : "VALIDATION_ERROR";
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "The image is too large. Please upload a file smaller than 10 MB."
        : "Invalid upload.";
    const body: ApiErrorBody = { error: { code, message } };
    res.status(code === "FILE_TOO_LARGE" ? 413 : 400).json(body);
    return;
  }

  if (err instanceof ZodError) {
    const body: ApiErrorBody = { error: { code: "VALIDATION_ERROR", message: "Invalid request data." } };
    res.status(400).json(body);
    return;
  }

  console.error("Unhandled server error:", err);
  const body: ApiErrorBody = {
    error: { code: "INTERNAL_ERROR", message: "Something went wrong. Please try again." }
  };
  res.status(500).json(body);
};
