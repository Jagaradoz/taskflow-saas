export type MemberRole = "owner" | "admin" | "member";

export type MembershipRequestType = "invite" | "request";
export type MembershipRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "rejected"
  | "revoked";

export interface MembershipRequest {
  id: string;
  orgId: string;
  type: MembershipRequestType;
  invitedUserId: string | null;
  invitedBy: string | null;
  requesterId: string | null;
  role: "admin" | "member";
  status: MembershipRequestStatus;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  resolvedBy: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Membership {
  id: string;
  userId: string;
  orgId: string;
  role: MemberRole;
  createdAt: Date;
}

export interface RequestUser {
  id: string;
  email: string;
  name: string;
}

export interface RequestMembership {
  id: string;
  role: MemberRole;
}

export interface Task {
  id: string;
  orgId: string;
  createdBy: string | null;
  title: string;
  description: string | null;
  isDone: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
