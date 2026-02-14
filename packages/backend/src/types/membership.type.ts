export type MemberRole = "owner" | "member";

export interface Membership {
  id: string;
  userId: string;
  orgId: string;
  role: MemberRole;
  createdAt: Date;
}

export interface MembershipRow {
  id: string;
  user_id: string;
  org_id: string;
  role: MemberRole;
  created_at: Date;
}

export interface MemberWithUserRow {
  id: string;
  user_id: string;
  org_id: string;
  role: MemberRole;
  created_at: Date;
  user_email: string;
  user_name: string;
}

export interface MemberWithUser extends Membership {
  user: {
    email: string;
    name: string;
  };
}
