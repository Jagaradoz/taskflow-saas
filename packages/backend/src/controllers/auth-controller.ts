// Libraries
import type { Request, Response } from "express";

// Local
import { BaseController } from "./base-controller.js";
import { authService } from "../services/auth-service.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";
import { ValidationError } from "../utils/errors.js";
import "../types/express.js";

class AuthController extends BaseController {
  async register(req: Request, res: Response): Promise<void> {
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

      this.handleSuccess(res, { user }, 201);
    } catch (error) {
      this.handleError(error, res, "register");
    }
  }

  async login(req: Request, res: Response): Promise<void> {
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

      this.handleSuccess(res, { user });
    } catch (error) {
      this.handleError(error, res, "login");
    }
  }

  logout(req: Request, res: Response): void {
    req.session.destroy((err) => {
      if (err) {
        this.handleError(err, res, "logout");
        return;
      }

      res.clearCookie("sid");
      this.handleSuccess(res, { message: "Logged out successfully" });
    });
  }

  async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError("User not found in session");
      }

      const user = await authService.getCurrentUser(userId);
      const currentOrgId = req.session.currentOrgId;

      this.handleSuccess(res, { user, currentOrgId });
    } catch (error) {
      this.handleError(error, res, "me");
    }
  }
}

export const authController = new AuthController();
