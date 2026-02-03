// Libraries
import type { Response } from "express";

// Local
import { AppError } from "../utils/errors.js";

interface SuccessResponse<T> {
  status: "success";
  data: T;
}

interface ErrorResponse {
  status: "error";
  message: string;
}

export abstract class BaseController {
  protected handleSuccess<T>(res: Response, data: T, statusCode = 200): void {
    const response: SuccessResponse<T> = {
      status: "success",
      data,
    };
    res.status(statusCode).json(response);
  }

  protected handleError(
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
}
