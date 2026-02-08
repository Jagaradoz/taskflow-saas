/**
 * Mock Organization Operations
 */

import type { Organization } from "@/types/organization";
import type { MemberRole } from "@/types/membership";
import { MOCK_ORGS } from "./fixtures";
import { getAuthState } from "./auth-mock";

export function getOrgs(): Organization[] {
  return MOCK_ORGS;
}

export function getOrgById(id: string): Organization | undefined {
  return MOCK_ORGS.find((o) => o.id === id);
}

export function getOrgBySlug(slug: string): Organization | undefined {
  return MOCK_ORGS.find((o) => o.slug === slug);
}

export function getCurrentOrg(): Organization | undefined {
  const state = getAuthState();
  if (!state.currentOrgId) return undefined;
  return getOrgById(state.currentOrgId);
}

export function getCurrentRole(): MemberRole | undefined {
  const state = getAuthState();
  if (!state.currentOrgId || !state.user) return undefined;
  const membership = state.memberships.find(
    (m) => m.orgId === state.currentOrgId,
  );
  return membership?.role;
}
