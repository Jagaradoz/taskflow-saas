/**
 * Mock Auth Operations
 */

import type { User } from "@/types/user";
import type { AuthState } from "./types";
import { STORAGE_KEYS as KEYS } from "./types";
import { MOCK_USERS, MOCK_MEMBERSHIPS, MOCK_ORGS } from "./fixtures";

export function getAuthState(): AuthState {
  const stored = localStorage.getItem(KEYS.AUTH);
  if (!stored) {
    return { user: null, currentOrgId: null, memberships: [] };
  }
  return JSON.parse(stored);
}

export function setAuthState(state: AuthState): void {
  localStorage.setItem(KEYS.AUTH, JSON.stringify(state));
}

export function mockLogin(email: string, _password: string): AuthState | null {
  const user = MOCK_USERS.find((u) => u.email === email);
  if (!user) return null;

  const memberships = MOCK_MEMBERSHIPS.filter((m) => m.userId === user.id).map(
    (m) => ({
      ...m,
      org: MOCK_ORGS.find((o) => o.id === m.orgId),
    }),
  );

  const state: AuthState = {
    user,
    currentOrgId: memberships[0]?.orgId || null,
    memberships,
  };

  setAuthState(state);
  return state;
}

export function mockRegister(
  name: string,
  email: string,
  _password: string,
): AuthState {
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    name,
    createdAt: new Date().toISOString(),
  };

  const state: AuthState = {
    user,
    currentOrgId: null,
    memberships: [],
  };

  setAuthState(state);
  return state;
}

export function mockLogout(): void {
  localStorage.removeItem(KEYS.AUTH);
}

export function mockSwitchOrg(orgId: string): AuthState | null {
  const state = getAuthState();
  if (!state.user) return null;

  const membership = state.memberships.find((m) => m.orgId === orgId);
  if (!membership) return null;

  state.currentOrgId = orgId;
  setAuthState(state);
  return state;
}
