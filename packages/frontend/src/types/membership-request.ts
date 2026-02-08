import type { MemberRole } from "./membership";
import type { Organization } from "./organization";
import type { User } from "./user";

/**
 * Membership request type (invite or join request)
 */
export type MembershipRequestType = "invite" | "request";

/**
 * Membership request status
 */
export type MembershipRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "rejected"
  | "revoked";

/**
 * Membership request type definition
 */
export interface MembershipRequest {
  id: string;
  orgId: string;
  type: MembershipRequestType;
  // Invite-specific
  invitedUserId?: string;
  invitedBy?: string;
  // Request-specific
  requesterId?: string;
  // Shared
  role: MemberRole;
  status: MembershipRequestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  // Populated relations
  org?: Organization;
  invitedUser?: User;
  inviter?: User;
  requester?: User;
}
