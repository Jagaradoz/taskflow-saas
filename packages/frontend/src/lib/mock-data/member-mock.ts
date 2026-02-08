/**
 * Mock Member Operations
 */

import type { User } from "@/types/user";
import type { Membership } from "@/types/membership";
import { MOCK_MEMBERSHIPS, MOCK_USERS } from "./fixtures";

export function getMembers(orgId: string): (Membership & { user: User })[] {
  return MOCK_MEMBERSHIPS.filter((m) => m.orgId === orgId).map((m) => ({
    ...m,
    user: MOCK_USERS.find((u) => u.id === m.userId)!,
  }));
}
