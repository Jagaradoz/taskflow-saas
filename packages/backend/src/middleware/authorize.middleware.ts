// Third-party
import type { Request, Response, NextFunction } from "express";

// Modules
import { ForbiddenError } from "../utils/errors.js";

// Types
import type { MemberRole } from "../types/membership.type.js";
import "../types/express.type.js";

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
