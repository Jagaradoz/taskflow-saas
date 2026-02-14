import type { MemberRole } from "./membership.type.js";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface UserRow {
  id: string;
  email: string;
  password: string;
  name: string;
  created_at: Date;
}

export interface MembershipWithOrgRow {
  id: string;
  org_id: string;
  org_name: string;
  org_slug: string;
  role: MemberRole;
}

export interface UserWithMemberships extends User {
  memberships: Array<{
    id: string;
    orgId: string;
    orgName: string;
    orgSlug: string;
    role: MemberRole;
  }>;
}
