import type { User } from '../types/user';
import type { Organization } from '../types/organization';
import type { Membership, MemberWithUser } from '../types/membership';
import type { MemberRole } from '../types/membership';
import type { Task } from '../types/task';
import type {
  MembershipRequest,
  MembershipRequestWithUser,
} from '../types/membership-request';

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'taskflow_mock';

interface MockStore {
  users: User[];
  organizations: Organization[];
  memberships: Membership[];
  tasks: Task[];
  membershipRequests: MembershipRequest[];
  authUserId: string | null;
}

const now = new Date().toISOString();

const DEFAULT_STORE: MockStore = {
  authUserId: null,
  users: [
    { id: 'u1', email: 'john@example.com', name: 'John Doe', createdAt: now },
    { id: 'u2', email: 'jane@example.com', name: 'Jane Smith', createdAt: now },
    { id: 'u3', email: 'alex@example.com', name: 'Alex Chen', createdAt: now },
    { id: 'u4', email: 'maria@example.com', name: 'Maria Kim', createdAt: now },
  ],
  organizations: [
    {
      id: 'org1',
      name: 'Acme Engineering',
      slug: 'acme-engineering',
      description: 'A fast-moving engineering team building great products.',
      createdAt: now,
      updatedAt: now,
    },
  ],
  memberships: [
    { id: 'm1', userId: 'u1', orgId: 'org1', role: 'owner', createdAt: now },
    { id: 'm2', userId: 'u2', orgId: 'org1', role: 'member', createdAt: now },
    { id: 'm3', userId: 'u3', orgId: 'org1', role: 'member', createdAt: now },
    { id: 'm4', userId: 'u4', orgId: 'org1', role: 'member', createdAt: now },
  ],
  tasks: [
    {
      id: 't1',
      orgId: 'org1',
      createdBy: 'u1',
      creatorName: 'John Doe',
      title: 'Set up project repository',
      description: null,
      isDone: true,
      isPinned: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 't2',
      orgId: 'org1',
      createdBy: 'u2',
      creatorName: 'Jane Smith',
      title: 'Design authentication flow',
      description: null,
      isDone: false,
      isPinned: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 't3',
      orgId: 'org1',
      createdBy: 'u1',
      creatorName: 'John Doe',
      title: 'Configure CI/CD pipeline',
      description: null,
      isDone: false,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 't4',
      orgId: 'org1',
      createdBy: 'u3',
      creatorName: 'Alex Chen',
      title: 'Write API documentation',
      description: null,
      isDone: false,
      isPinned: false,
      createdAt: now,
      updatedAt: now,
    },
  ],
  membershipRequests: [],
};

const load = (): MockStore => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockStore) : structuredClone(DEFAULT_STORE);
  } catch {
    return structuredClone(DEFAULT_STORE);
  }
};

const save = (store: MockStore): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const uid = (): string => crypto.randomUUID();

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface AuthState {
  user: User;
  memberships: Array<{
    id: string;
    orgId: string;
    orgName: string;
    orgSlug: string;
    role: MemberRole;
  }>;
}

/** Mock login — matches any existing user by email (password ignored). */
export const mockLogin = (email: string, _password: string): AuthState | null => {
  const store = load();
  const user = store.users.find((u) => u.email === email);
  if (!user) return null;

  store.authUserId = user.id;
  save(store);

  return buildAuthState(store, user);
};

/** Mock register — creates a new user and logs them in. */
export const mockRegister = (
  name: string,
  email: string,
  _password: string,
): AuthState | null => {
  const store = load();
  if (store.users.some((u) => u.email === email)) return null;

  const user: User = { id: uid(), email, name, createdAt: new Date().toISOString() };
  store.users.push(user);
  store.authUserId = user.id;
  save(store);

  return buildAuthState(store, user);
};

export const mockLogout = (): void => {
  const store = load();
  store.authUserId = null;
  save(store);
};

export const getAuthState = (): AuthState | null => {
  const store = load();
  if (!store.authUserId) return null;
  const user = store.users.find((u) => u.id === store.authUserId);
  if (!user) return null;
  return buildAuthState(store, user);
};

const buildAuthState = (store: MockStore, user: User): AuthState => {
  const memberships = store.memberships
    .filter((m) => m.userId === user.id)
    .map((m) => {
      const org = store.organizations.find((o) => o.id === m.orgId)!;
      return {
        id: m.id,
        orgId: m.orgId,
        orgName: org.name,
        orgSlug: org.slug,
        role: m.role,
      };
    });
  return { user, memberships };
};

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

export const getOrganization = (orgId: string): Organization | null => {
  const store = load();
  return store.organizations.find((o) => o.id === orgId) ?? null;
};

export const createOrganization = (
  userId: string,
  name: string,
  slug: string,
  description?: string,
): Organization => {
  const store = load();
  const ts = new Date().toISOString();
  const org: Organization = {
    id: uid(),
    name,
    slug,
    description: description ?? null,
    createdAt: ts,
    updatedAt: ts,
  };
  store.organizations.push(org);
  store.memberships.push({
    id: uid(),
    userId,
    orgId: org.id,
    role: 'owner',
    createdAt: ts,
  });
  save(store);
  return org;
};

export const updateOrganization = (
  orgId: string,
  updates: Partial<Pick<Organization, 'name' | 'description'>>,
): Organization | null => {
  const store = load();
  const org = store.organizations.find((o) => o.id === orgId);
  if (!org) return null;
  Object.assign(org, updates, { updatedAt: new Date().toISOString() });
  save(store);
  return org;
};

export const deleteOrganization = (orgId: string): boolean => {
  const store = load();
  const idx = store.organizations.findIndex((o) => o.id === orgId);
  if (idx === -1) return false;
  store.organizations.splice(idx, 1);
  store.memberships = store.memberships.filter((m) => m.orgId !== orgId);
  store.tasks = store.tasks.filter((t) => t.orgId !== orgId);
  store.membershipRequests = store.membershipRequests.filter((r) => r.orgId !== orgId);
  save(store);
  return true;
};

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------

export const getTasksByOrg = (orgId: string): Task[] => {
  const store = load();
  return store.tasks.filter((t) => t.orgId === orgId);
};

export const createTask = (orgId: string, userId: string, title: string): Task => {
  const store = load();
  const user = store.users.find((u) => u.id === userId);
  const ts = new Date().toISOString();
  const task: Task = {
    id: uid(),
    orgId,
    createdBy: userId,
    creatorName: user?.name ?? null,
    title,
    description: null,
    isDone: false,
    isPinned: false,
    createdAt: ts,
    updatedAt: ts,
  };
  store.tasks.push(task);
  save(store);
  return task;
};

export const updateTask = (
  taskId: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'isDone' | 'isPinned'>>,
): Task | null => {
  const store = load();
  const task = store.tasks.find((t) => t.id === taskId);
  if (!task) return null;
  Object.assign(task, updates, { updatedAt: new Date().toISOString() });
  save(store);
  return task;
};

export const deleteTask = (taskId: string): boolean => {
  const store = load();
  const idx = store.tasks.findIndex((t) => t.id === taskId);
  if (idx === -1) return false;
  store.tasks.splice(idx, 1);
  save(store);
  return true;
};

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export const getMembersByOrg = (orgId: string): MemberWithUser[] => {
  const store = load();
  return store.memberships
    .filter((m) => m.orgId === orgId)
    .map((m) => {
      const user = store.users.find((u) => u.id === m.userId)!;
      return { ...m, user: { email: user.email, name: user.name } };
    });
};

export const removeMember = (membershipId: string): boolean => {
  const store = load();
  const idx = store.memberships.findIndex((m) => m.id === membershipId);
  if (idx === -1) return false;
  store.memberships.splice(idx, 1);
  save(store);
  return true;
};

// ---------------------------------------------------------------------------
// Membership Requests (Invites & Join Requests)
// ---------------------------------------------------------------------------

export const getOrgInvites = (orgId: string): MembershipRequestWithUser[] => {
  const store = load();
  return store.membershipRequests
    .filter((r) => r.orgId === orgId && r.type === 'invite')
    .map((r) => enrichRequest(store, r));
};

export const getOrgRequests = (orgId: string): MembershipRequestWithUser[] => {
  const store = load();
  return store.membershipRequests
    .filter((r) => r.orgId === orgId && r.type === 'request')
    .map((r) => enrichRequest(store, r));
};

export const getMyInvites = (userId: string): MembershipRequestWithUser[] => {
  const store = load();
  return store.membershipRequests
    .filter((r) => r.invitedUserId === userId && r.type === 'invite')
    .map((r) => enrichRequest(store, r));
};

export const getMyRequests = (userId: string): MembershipRequestWithUser[] => {
  const store = load();
  return store.membershipRequests
    .filter((r) => r.requesterId === userId && r.type === 'request')
    .map((r) => enrichRequest(store, r));
};

export const createInvite = (
  orgId: string,
  invitedByUserId: string,
  invitedEmail: string,
): MembershipRequest | null => {
  const store = load();
  const target = store.users.find((u) => u.email === invitedEmail);
  if (!target) return null;

  const ts = new Date().toISOString();
  const req: MembershipRequest = {
    id: uid(),
    orgId,
    type: 'invite',
    invitedUserId: target.id,
    invitedBy: invitedByUserId,
    requesterId: null,
    role: 'member',
    status: 'pending',
    message: null,
    createdAt: ts,
    updatedAt: ts,
    resolvedAt: null,
    resolvedBy: null,
  };
  store.membershipRequests.push(req);
  save(store);
  return req;
};

export const createJoinRequest = (
  orgSlug: string,
  requesterId: string,
  message?: string,
): MembershipRequest | null => {
  const store = load();
  const org = store.organizations.find((o) => o.slug === orgSlug);
  if (!org) return null;

  const ts = new Date().toISOString();
  const req: MembershipRequest = {
    id: uid(),
    orgId: org.id,
    type: 'request',
    invitedUserId: null,
    invitedBy: null,
    requesterId,
    role: 'member',
    status: 'pending',
    message: message ?? null,
    createdAt: ts,
    updatedAt: ts,
    resolvedAt: null,
    resolvedBy: null,
  };
  store.membershipRequests.push(req);
  save(store);
  return req;
};

export const resolveRequest = (
  requestId: string,
  resolvedByUserId: string,
  action: 'accepted' | 'declined' | 'rejected' | 'revoked',
): boolean => {
  const store = load();
  const req = store.membershipRequests.find((r) => r.id === requestId);
  if (!req || req.status !== 'pending') return false;

  const ts = new Date().toISOString();
  req.status = action;
  req.resolvedAt = ts;
  req.resolvedBy = resolvedByUserId;
  req.updatedAt = ts;

  if (action === 'accepted') {
    const userId = req.type === 'invite' ? req.invitedUserId! : req.requesterId!;
    store.memberships.push({
      id: uid(),
      userId,
      orgId: req.orgId,
      role: req.role,
      createdAt: ts,
    });
  }

  save(store);
  return true;
};

// ---------------------------------------------------------------------------
// Reset
// ---------------------------------------------------------------------------

export const resetMockData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const enrichRequest = (
  store: MockStore,
  r: MembershipRequest,
): MembershipRequestWithUser => {
  const userId = r.type === 'invite' ? r.invitedUserId : r.requesterId;
  const user = store.users.find((u) => u.id === userId);
  const inviter = r.invitedBy
    ? store.users.find((u) => u.id === r.invitedBy)
    : undefined;
  const org = store.organizations.find((o) => o.id === r.orgId);

  return {
    ...r,
    user: { name: user?.name ?? 'Unknown', email: user?.email ?? '' },
    ...(inviter ? { inviter: { name: inviter.name } } : {}),
    ...(org ? { org: { name: org.name, slug: org.slug } } : {}),
  };
};
