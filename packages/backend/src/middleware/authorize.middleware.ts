// Libraries
import type { Request, Response, NextFunction } from "express";

// Local
import { ForbiddenError } from "../utils/errors.js";
import type { MemberRole } from "../types/membership.js";
import "../types/express.js";

export const authorize = (...allowedRoles: MemberRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const membership = req.membership;

    if (!membership) {
      next(new ForbiddenError("Membership not loaded"));
      return;
    }

    if (!allowedRoles.includes(membership.role)) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
};
