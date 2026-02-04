// Libraries
import type { Request, Response, NextFunction } from "express";

// Local
import { memberRepository } from "../repositories/member-repository.js";
import { ForbiddenError } from "../utils/errors.js";
import type { RequestMembership } from "../types/index.js";
import "../types/express.js";

export const requireTenant = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const currentOrgId = req.session.currentOrgId;
    const userId = req.user?.id;

    if (!currentOrgId) {
      throw new ForbiddenError("No organization selected");
    }

    if (!userId) {
      throw new ForbiddenError("User not authenticated");
    }

    const membership = await memberRepository.findByUserAndOrg(userId, currentOrgId);
    if (!membership) {
      throw new ForbiddenError("Not a member of this organization");
    }

    const requestMembership: RequestMembership = {
      id: membership.id,
      role: membership.role,
    };

    req.currentOrgId = currentOrgId;
    req.membership = requestMembership;
    next();
  } catch (error) {
    next(error);
  }
};
