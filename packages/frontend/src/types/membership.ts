import type { Organization } from "./organization";
import type { User } from "./user";

/**
 * Member role enum
 */
export type MemberRole = "owner" | "member";

/**
 * Membership type definition
 */
export interface Membership {
  id: string;
  userId: string;
  orgId: string;
  role: MemberRole;
  createdAt: string;
  // Populated relations
  org?: Organization;
  user?: User;
}
