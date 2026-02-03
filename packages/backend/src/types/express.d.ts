import type { RequestUser, RequestMembership } from "./index.js";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      currentOrgId?: string;
      membership?: RequestMembership;
    }
  }
}

export {};
