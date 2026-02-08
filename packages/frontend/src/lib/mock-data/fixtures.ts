/**
 * Mock data fixtures
 */

import type { User } from "@/types/user";
import type { Organization } from "@/types/organization";
import type { Membership } from "@/types/membership";
import type { Task } from "@/types/task";
import type { MembershipRequest } from "@/types/membership-request";

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    email: "john@example.com",
    name: "John Doe",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    email: "jane@example.com",
    name: "Jane Smith",
    createdAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "user-3",
    email: "bob@example.com",
    name: "Bob Wilson",
    createdAt: "2026-01-03T00:00:00Z",
  },
  {
    id: "user-4",
    email: "alice@example.com",
    name: "Alice Brown",
    createdAt: "2026-01-04T00:00:00Z",
  },
];

export const MOCK_ORGS: Organization[] = [
  {
    id: "org-1",
    name: "Acme Corp",
    slug: "acme-corp",
    description: "Building the future",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "org-2",
    name: "Startup Inc",
    slug: "startup-inc",
    description: "Move fast and build things",
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
  },
];

export const MOCK_MEMBERSHIPS: Membership[] = [
  {
    id: "mem-1",
    userId: "user-1",
    orgId: "org-1",
    role: "owner",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "mem-2",
    userId: "user-2",
    orgId: "org-1",
    role: "member",
    createdAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "mem-3",
    userId: "user-1",
    orgId: "org-2",
    role: "member",
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "mem-4",
    userId: "user-3",
    orgId: "org-2",
    role: "owner",
    createdAt: "2026-01-05T00:00:00Z",
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    orgId: "org-1",
    createdBy: "user-1",
    creatorName: "John Doe",
    title: "Setup project infrastructure",
    isDone: true,
    isPinned: false,
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "task-2",
    orgId: "org-1",
    createdBy: "user-1",
    creatorName: "John Doe",
    title: "Implement authentication system",
    isDone: false,
    isPinned: true,
    createdAt: "2026-01-11T00:00:00Z",
    updatedAt: "2026-01-11T00:00:00Z",
  },
  {
    id: "task-3",
    orgId: "org-1",
    createdBy: "user-2",
    creatorName: "Jane Smith",
    title: "Design database schema",
    isDone: false,
    isPinned: false,
    createdAt: "2026-01-12T00:00:00Z",
    updatedAt: "2026-01-12T00:00:00Z",
  },
  {
    id: "task-4",
    orgId: "org-1",
    createdBy: "user-2",
    creatorName: "Jane Smith",
    title: "Create API documentation",
    isDone: false,
    isPinned: true,
    createdAt: "2026-01-13T00:00:00Z",
    updatedAt: "2026-01-13T00:00:00Z",
  },
  {
    id: "task-5",
    orgId: "org-2",
    createdBy: "user-3",
    creatorName: "Bob Wilson",
    title: "Launch marketing campaign",
    isDone: false,
    isPinned: false,
    createdAt: "2026-01-14T00:00:00Z",
    updatedAt: "2026-01-14T00:00:00Z",
  },
];

export const MOCK_REQUESTS: MembershipRequest[] = [
  {
    id: "req-1",
    orgId: "org-1",
    type: "invite",
    invitedUserId: "user-4",
    invitedBy: "user-1",
    role: "member",
    status: "pending",
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "req-2",
    orgId: "org-2",
    type: "request",
    requesterId: "user-2",
    role: "member",
    status: "pending",
    message: "I would like to join your team!",
    createdAt: "2026-01-16T00:00:00Z",
    updatedAt: "2026-01-16T00:00:00Z",
  },
];
