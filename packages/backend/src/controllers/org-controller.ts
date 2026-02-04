// Libraries
import type { Request, Response } from "express";

// Local
import { BaseController } from "./base-controller.js";
import { orgService } from "../services/org-service.js";
import { createOrgSchema, updateOrgSchema } from "../validators/org.schema.js";
import { ValidationError } from "../utils/errors.js";
import "../types/express.js";

class OrgController extends BaseController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError("User not found in session");
      }

      const parseResult = createOrgSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError(
          "Validation failed",
          parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        );
      }

      const org = await orgService.createOrg(userId, parseResult.data);

      // Automatically switch to the new org
      req.session.currentOrgId = org.id;

      this.handleSuccess(res, { organization: org }, 201);
    } catch (error) {
      this.handleError(error, res, "create");
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError("User not found in session");
      }

      const orgId = req.params.id;
      if (!orgId) {
        throw new ValidationError("Organization ID is required");
      }
      const org = await orgService.getOrgById(orgId, userId);

      this.handleSuccess(res, { organization: org });
    } catch (error) {
      this.handleError(error, res, "getById");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const orgId = req.params.id;
      if (!orgId) {
        throw new ValidationError("Organization ID is required");
      }

      const parseResult = updateOrgSchema.safeParse(req.body);
      if (!parseResult.success) {
        throw new ValidationError(
          "Validation failed",
          parseResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        );
      }

      const org = await orgService.updateOrg(orgId, parseResult.data);

      this.handleSuccess(res, { organization: org });
    } catch (error) {
      this.handleError(error, res, "update");
    }
  }

  async switch(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError("User not found in session");
      }

      const orgId = req.params.id;
      if (!orgId) {
        throw new ValidationError("Organization ID is required");
      }
      const org = await orgService.switchOrg(userId, orgId);

      req.session.currentOrgId = org.id;

      this.handleSuccess(res, {
        organization: org,
        message: "Switched organization",
      });
    } catch (error) {
      this.handleError(error, res, "switch");
    }
  }
}

export const orgController = new OrgController();
