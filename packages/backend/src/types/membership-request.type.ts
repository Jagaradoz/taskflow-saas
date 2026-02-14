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
  role: "member";
  status: MembershipRequestStatus;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  resolvedBy: string | null;
}

export interface MembershipRequestRow {
  id: string;
  org_id: string;
  type: MembershipRequestType;
  invited_user_id: string | null;
  invited_by: string | null;
  requester_id: string | null;
  role: "member";
  status: MembershipRequestStatus;
  message: string | null;
  created_at: Date;
  updated_at: Date;
  resolved_at: Date | null;
  resolved_by: string | null;
}

export interface MembershipRequestWithUserRow extends MembershipRequestRow {
  user_name: string;
  user_email: string;
  inviter_name: string | null;
  org_name: string | null;
  org_slug: string | null;
}

export interface MembershipRequestWithUser extends MembershipRequest {
  user: {
    name: string;
    email: string;
  };
  inviter?: {
    name: string;
  };
  org?: {
    name: string;
    slug: string;
  };
}

export interface CreateMembershipRequestData {
  orgId: string;
  type: MembershipRequestType;
  invitedUserId?: string;
  invitedBy?: string;
  requesterId?: string;
  role: "member";
  message?: string;
}
