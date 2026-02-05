import type { Request, Response } from "express";
import { inviteService } from "../services/invite.service.js";
import { createInviteSchema } from "../validators/invite.schema.js";
import { ValidationError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";
import "../types/express.js";

// @route POST /api/orgs/:orgId/invites
// @desc  Create invite (owner only)
export async function create(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const invitedBy = req.user?.id;

    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (!invitedBy) {
      throw new ValidationError("User not found in session");
    }

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

    const invite = await inviteService.createInvite(
      orgId,
      parseResult.data.userId,
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
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    const status = req.query.status as string | undefined;
    const invites = await inviteService.listOrgInvites(
      orgId,
      status as
        | "pending"
        | "accepted"
        | "declined"
        | "rejected"
        | "revoked"
        | undefined,
    );

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

    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (!revokedBy) {
      throw new ValidationError("User not found in session");
    }
    if (!inviteId) {
      throw new ValidationError("Invite ID is required");
    }

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
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

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

    if (!userId) {
      throw new ValidationError("User not found in session");
    }
    if (!inviteId) {
      throw new ValidationError("Invite ID is required");
    }

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

    if (!userId) {
      throw new ValidationError("User not found in session");
    }
    if (!inviteId) {
      throw new ValidationError("Invite ID is required");
    }

    await inviteService.declineInvite(inviteId, userId);

    sendSuccess(res, { message: "Invite declined successfully" });
  } catch (error) {
    sendError(error, res, "decline");
  }
}
