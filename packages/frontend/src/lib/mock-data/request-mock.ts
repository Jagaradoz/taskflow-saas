/**
 * Mock Membership Request Operations (Invites & Join Requests)
 */

import type { MembershipRequest } from "@/types/membership-request";
import { STORAGE_KEYS } from "./types";
import { MOCK_REQUESTS, MOCK_ORGS, MOCK_USERS } from "./fixtures";

function getRequests(): MembershipRequest[] {
  const stored = localStorage.getItem(STORAGE_KEYS.REQUESTS);
  return stored ? JSON.parse(stored) : MOCK_REQUESTS;
}

function setRequests(requests: MembershipRequest[]): void {
  localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
}

// ============================================================================
// INVITE OPERATIONS
// ============================================================================

export function getOrgInvites(orgId: string): MembershipRequest[] {
  return getRequests()
    .filter((r) => r.orgId === orgId && r.type === "invite")
    .map((r) => ({
      ...r,
      org: MOCK_ORGS.find((o) => o.id === r.orgId),
      invitedUser: MOCK_USERS.find((u) => u.id === r.invitedUserId),
      inviter: MOCK_USERS.find((u) => u.id === r.invitedBy),
    }));
}

export function getMyInvites(userId: string): MembershipRequest[] {
  return getRequests()
    .filter(
      (r) =>
        r.invitedUserId === userId &&
        r.type === "invite" &&
        r.status === "pending",
    )
    .map((r) => ({
      ...r,
      org: MOCK_ORGS.find((o) => o.id === r.orgId),
      inviter: MOCK_USERS.find((u) => u.id === r.invitedBy),
    }));
}

// ============================================================================
// JOIN REQUEST OPERATIONS
// ============================================================================

export function getOrgJoinRequests(orgId: string): MembershipRequest[] {
  return getRequests()
    .filter((r) => r.orgId === orgId && r.type === "request")
    .map((r) => ({
      ...r,
      org: MOCK_ORGS.find((o) => o.id === r.orgId),
      requester: MOCK_USERS.find((u) => u.id === r.requesterId),
    }));
}

export function getMyJoinRequests(userId: string): MembershipRequest[] {
  return getRequests()
    .filter((r) => r.requesterId === userId && r.type === "request")
    .map((r) => ({
      ...r,
      org: MOCK_ORGS.find((o) => o.id === r.orgId),
    }));
}
