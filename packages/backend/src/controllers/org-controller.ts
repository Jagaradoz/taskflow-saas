import type { Request, Response } from "express";
import { orgService } from "../services/org-service.js";
import { createOrgSchema, updateOrgSchema } from "../validators/org.schema.js";
import { ValidationError, ForbiddenError, UnauthorizedError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";
import "../types/express.js";

// @route POST /api/orgs
// @desc  Create organization (authenticated, no tenant required)
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
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

    sendSuccess(res, { organization: org }, 201);
  } catch (error) {
    sendError(error, res, "create");
  }
}

// @route GET /api/orgs/:id
// @desc  Get organization (authenticated + member of org)
export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }

    const orgId = req.params.id;
    if (!orgId) {
      throw new ValidationError("Organization ID is required");
    }

    const org = await orgService.getOrgById(orgId, userId);

    sendSuccess(res, { organization: org });
  } catch (error) {
    sendError(error, res, "getById");
  }
}

// @route PATCH /api/orgs/:id
// @desc  Update organization (owner only)
export async function update(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.params.id;
    if (!orgId) {
      throw new ValidationError("Organization ID is required");
    }

    // Ensure the URL org matches the session org to prevent cross-org updates
    if (orgId !== req.currentOrgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You can only update your current organization.",
      );
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

    sendSuccess(res, { organization: org });
  } catch (error) {
    sendError(error, res, "update");
  }
}

// @route DELETE /api/orgs/:id
// @desc  Delete organization (owner only)
export async function deleteOrg(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }

    const orgId = req.params.id;
    if (!orgId) {
      throw new ValidationError("Organization ID is required");
    }

    if (orgId !== req.currentOrgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You can only delete your current organization.",
      );
    }

    await orgService.deleteOrg(orgId, userId);

    req.session.currentOrgId = undefined;

    sendSuccess(res, { message: "Organization deleted successfully" });
  } catch (error) {
    sendError(error, res, "deleteOrg");
  }
}

// @route POST /api/orgs/:id/switch
// @desc  Switch active organization (authenticated)
export async function switchOrg(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }

    const orgId = req.params.id;
    if (!orgId) {
      throw new ValidationError("Organization ID is required");
    }

    const org = await orgService.switchOrg(userId, orgId);

    req.session.currentOrgId = org.id;

    sendSuccess(res, {
      organization: org,
      message: "Switched organization",
    });
  } catch (error) {
    sendError(error, res, "switch");
  }
}
