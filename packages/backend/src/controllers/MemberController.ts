// Libraries
import type { Request, Response } from "express";

// Local
import { BaseController } from "./BaseController.js";
import { memberService } from "../services/memberService.js";
import { updateMemberSchema } from "../validators/member.schema.js";
import { ValidationError } from "../utils/errors.js";
import "../types/express.js";

class MemberController extends BaseController {
  async list(req: Request, res: Response): Promise<void> {
    try {
      const orgId = req.currentOrgId;
      if (!orgId) {
        throw new ValidationError("Organization not selected");
      }

      const members = await memberService.listMembers(orgId);

      this.handleSuccess(res, { members });
    } catch (error) {
      this.handleError(error, res, "list");
    }
  }

  async update(req: Request, res: Response): Promise<void> {
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

      this.handleSuccess(res, { membership });
    } catch (error) {
      this.handleError(error, res, "update");
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
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

      this.handleSuccess(res, { message: "Member removed successfully" });
    } catch (error) {
      this.handleError(error, res, "remove");
    }
  }
}

export const memberController = new MemberController();
