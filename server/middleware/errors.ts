import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ApiErrorCode } from "../../shared/schema.js";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;
  constructor(code: ApiErrorCode, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "ApiError";
  }
}

/** Wraps an async route handler so rejected promises reach Express's error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
