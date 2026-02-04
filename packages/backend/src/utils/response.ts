import type { Response } from "express";
import { AppError } from "./errors.js";

interface SuccessResponse<T> {
  status: "success";
  data: T;
}

interface ErrorResponse {
  status: "error";
  message: string;
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
    res.status(error.statusCode).json(response);
    return;
  }

  console.error(`[${operation}] Unexpected error:`, error);
  const response: ErrorResponse = {
    status: "error",
    message: "Internal server error",
  };
  res.status(500).json(response);
}
