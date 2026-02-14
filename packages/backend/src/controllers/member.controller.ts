// Third-party
import type { Request, Response } from "express";

// Modules
import { memberService } from "../services/member.service.js";
import { ValidationError, UnauthorizedError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";

// Types
import "../types/express.type.js";

// @route GET /api/members
// @desc  List members (any member can view)
export async function list(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    // List members
    const members = await memberService.listMembers(orgId);

    sendSuccess(res, { members });
  } catch (error) {
    sendError(error, res, "list");
  }
}

// @route DELETE /api/members/:id
// @desc  Remove member (owner only)
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const userId = req.user?.id;

    // Validate organization
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    // Validate user
    if (!userId) {
      throw new UnauthorizedError("User not found in session");
    }

    const membershipId = req.params.id;

    // Validate membership ID
    if (!membershipId) {
      throw new ValidationError("Membership ID is required");
    }

    // Remove member
    await memberService.removeMember(membershipId, orgId, userId);

    sendSuccess(res, { message: "Member removed successfully" });
  } catch (error) {
    sendError(error, res, "remove");
  }
}
