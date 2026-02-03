export type MemberRole = "owner" | "member";

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
