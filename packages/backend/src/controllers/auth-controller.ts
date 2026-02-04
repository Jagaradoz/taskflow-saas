import type { Request, Response } from "express";
import { authService } from "../services/auth-service.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";
import { ValidationError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";
import "../types/express.js";

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    const user = await authService.register(parseResult.data);
    req.session.userId = user.id;

    sendSuccess(res, { user }, 201);
  } catch (error) {
    sendError(error, res, "register");
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    const user = await authService.login(parseResult.data);
    req.session.userId = user.id;

    sendSuccess(res, { user });
  } catch (error) {
    sendError(error, res, "login");
  }
}

export function logout(req: Request, res: Response): void {
  req.session.destroy((err) => {
    if (err) {
      sendError(err, res, "logout");
      return;
    }

    res.clearCookie("sid");
    sendSuccess(res, { message: "Logged out successfully" });
  });
}

export async function me(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

    const user = await authService.getCurrentUser(userId);
    const currentOrgId = req.session.currentOrgId;

    sendSuccess(res, { user, currentOrgId });
  } catch (error) {
    sendError(error, res, "me");
  }
}
