import type { Response } from "express";
import { AppError, ValidationError } from "./errors.js";
import { logger } from "../config/logger.js";

interface SuccessResponse<T> {
  status: "success";
  data: T;
}

interface ErrorResponse {
  status: "error";
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  const response: SuccessResponse<T> = {
    status: "success",
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  error: unknown,
  res: Response,
  operation: string,
): void {
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      status: "error",
      message: error.message,
    };

    if (error instanceof ValidationError && error.errors) {
      response.errors = error.errors;
    }

    res.status(error.statusCode).json(response);
    return;
  }

  logger.error({ err: error, operation }, `[${operation}] Unexpected error`);
  const response: ErrorResponse = {
    status: "error",
    message: "Internal server error",
  };
  res.status(500).json(response);
}
