// Local
import type { MemberRole } from "./membership.js";

export interface RequestUser {
  id: string;
  email: string;
  name: string;
}

export interface RequestMembership {
  id: string;
  role: MemberRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      currentOrgId?: string;
      membership?: RequestMembership;
    }
  }
}
