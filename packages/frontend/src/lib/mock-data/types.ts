/**
 * Shared types and constants for mock data
 */

import type { Membership } from "@/types/membership";
import type { User } from "@/types/user";

export interface AuthState {
  user: User | null;
  currentOrgId: string | null;
  memberships: Membership[];
}

export const STORAGE_KEYS = {
  AUTH: "taskflow_auth",
  TASKS: "taskflow_tasks",
  REQUESTS: "taskflow_requests",
} as const;
