/**
 * Mock Data Layer for UI-First Development
 *
 * Provides mock data and state management for developing UI components
 * without backend dependency. All data operations use localStorage persistence.
 *
 * @module mock-data
 */

// Initialize mock data on import
import "./init";

// Export types
export type { AuthState } from "./types";
export { STORAGE_KEYS } from "./types";

// Export fixtures (for testing/seeding purposes)
export {
  MOCK_USERS,
  MOCK_ORGS,
  MOCK_MEMBERSHIPS,
  MOCK_TASKS,
  MOCK_REQUESTS,
} from "./fixtures";

// Export auth operations
export {
  getAuthState,
  setAuthState,
  mockLogin,
  mockRegister,
  mockLogout,
  mockSwitchOrg,
} from "./auth-mock";

// Export org operations
export {
  getOrgs,
  getOrgById,
  getOrgBySlug,
  getCurrentOrg,
  getCurrentRole,
} from "./org-mock";

// Export member operations
export { getMembers } from "./member-mock";

// Export task operations
export {
  getTasksByOrg,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from "./task-mock";

// Export request operations
export {
  getOrgInvites,
  getMyInvites,
  getOrgJoinRequests,
  getMyJoinRequests,
} from "./request-mock";

// Export utilities
export { initializeMockData, resetMockData } from "./init";
