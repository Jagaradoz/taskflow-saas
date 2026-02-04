import type { Request, Response } from "express";
import { memberService } from "../services/member-service.js";
import { updateMemberSchema } from "../validators/member.schema.js";
import { ValidationError } from "../utils/errors.js";
import { sendSuccess, sendError } from "../utils/response.js";
import "../types/express.js";

export async function list(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    const members = await memberService.listMembers(orgId);

    sendSuccess(res, { members });
  } catch (error) {
    sendError(error, res, "list");
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }

    const membershipId = req.params.id;
    if (!membershipId) {
      throw new ValidationError("Membership ID is required");
    }

    const parseResult = updateMemberSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new ValidationError(
        "Validation failed",
        parseResult.error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      );
    }

    const membership = await memberService.updateRole(
      membershipId,
      orgId,
      parseResult.data.role,
    );

    sendSuccess(res, { membership });
  } catch (error) {
    sendError(error, res, "update");
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const orgId = req.currentOrgId;
    const userId = req.user?.id;

    if (!orgId) {
      throw new ValidationError("Organization not selected");
    }
    if (!userId) {
      throw new ValidationError("User not found in session");
    }

    const membershipId = req.params.id;
    if (!membershipId) {
      throw new ValidationError("Membership ID is required");
    }

    await memberService.removeMember(membershipId, orgId, userId);

    sendSuccess(res, { message: "Member removed successfully" });
  } catch (error) {
    sendError(error, res, "remove");
  }
}
