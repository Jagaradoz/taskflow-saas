// Third-party
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

// Config
import { env } from "../config/env.config.js";
import { logger } from "../config/logger.config.js";

// Modules
import { AppError, ValidationError } from "../utils/errors.js";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    const response: {
      status: string;
      message: string;
      errors?: Array<{ field: string; message: string }>;
    } = {
      status: "error",
      message: err.message,
    };

    if (err instanceof ValidationError && err.errors) {
      response.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  const message =
    env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(500).json({
    status: "error",
    message,
  });
};
