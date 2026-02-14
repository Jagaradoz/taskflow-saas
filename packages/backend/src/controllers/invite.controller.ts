// Third-party
import type { Request, Response } from "express";

// Modules
import { inviteService } from "../services/invite.service.js";
import { createInviteSchema } from "../validators/invite.schema.js";
import { ValidationError, ForbiddenError, UnauthorizedError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Types
import "../types/express.type.js";

// @route POST /api/orgs/:orgId/invites
// @desc  Create invite (owner only)
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const invitedBy = req.user?.id;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (req.params.orgId && req.params.orgId !== orgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You are currently browsing a different organization.",
      );
    }

    // Validate invited by
    if (!invitedBy) {
      throw new UnauthorizedError("User not found in session");
    }

    // Validate invite data
    const parseResult = createInviteSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    // Create an invite
    const invite = await inviteService.createInvite(
      orgId,
      parseResult.data.email,
      parseResult.data.role,
      invitedBy,
    );

    sendSuccess(res, { invite }, 201);
  } catch (error) {
    sendError(error, res, "create");
  }
}

// @route GET /api/orgs/:orgId/invites
// @desc  List org invites (owner only)
export async function list(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (req.params.orgId && req.params.orgId !== orgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You are currently browsing a different organization.",
      );
    }

    // Validate status
    const validStatuses = ["pending", "accepted", "declined", "rejected", "revoked"] as const;
    const statusParam = req.query.status as string | undefined;
    if (statusParam && !validStatuses.includes(statusParam as typeof validStatuses[number])) {
      throw new ValidationError(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      );
    }
    const status = statusParam as typeof validStatuses[number] | undefined;
    const invites = await inviteService.listOrgInvites(orgId, status);

    sendSuccess(res, { invites });
  } catch (error) {
    sendError(error, res, "list");
  }
}

// @route DELETE /api/orgs/:orgId/invites/:id
// @desc  Revoke invite (owner only)
export async function revoke(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const revokedBy = req.user?.id;
    const inviteId = req.params.id;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (req.params.orgId && req.params.orgId !== orgId) {
      throw new ForbiddenError(
        "Organization ID mismatch. You are currently browsing a different organization.",
      );
    }

    // Validate user
    if (!revokedBy) {
      throw new UnauthorizedError("User not found in session");
    }
    if (!inviteId) {
      throw new ValidationError("Invite ID is required");
    }

    // Revoke an invite
    await inviteService.revokeInvite(inviteId, orgId, revokedBy);

    sendSuccess(res, { message: "Invite revoked successfully" });
  } catch (error) {
    sendError(error, res, "revoke");
  }
}

// @route GET /api/me/invites
// @desc  Get my pending invites
export async function getMyInvites(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;

    // Validate user
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }

    // Get my invites
    const invites = await inviteService.getMyInvites(userId);

    sendSuccess(res, { invites });
  } catch (error) {
    sendError(error, res, "getMyInvites");
  }
}

// @route POST /api/me/invites/:id/accept
// @desc  Accept invite
export async function accept(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const inviteId = req.params.id;

    // Validate user
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }
    if (!inviteId) {
      throw new ValidationError("Invite ID is required");
    }

    // Accept an invite
    const membership = await inviteService.acceptInvite(inviteId, userId);

    sendSuccess(res, { membership });
  } catch (error) {
    sendError(error, res, "accept");
  }
}

// @route POST /api/me/invites/:id/decline
// @desc  Decline invite
export async function decline(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const inviteId = req.params.id;

    // Validate user
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }
    if (!inviteId) {
      throw new ValidationError("Invite ID is required");
    }

    // Decline an invite
    await inviteService.declineInvite(inviteId, userId);

    sendSuccess(res, { message: "Invite declined successfully" });
  } catch (error) {
    sendError(error, res, "decline");
  }
}
