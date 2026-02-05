import type { Request, Response } from "express";
import { authService } from "../services/auth-service.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";
import { ValidationError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";
import "../types/express.js";

// @route POST /api/auth/register
// @desc  Register new user (public)
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

// @route POST /api/auth/login
// @desc  Login (public)
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

// @route POST /api/auth/logout
// @desc  Logout (authenticated)
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

// @route GET /api/auth/me
// @desc  Get current user (authenticated)
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
