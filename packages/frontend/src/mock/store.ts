import type { Membership } from '../types/membership';
import type { MembershipRequest } from '../types/membership-request';
import type { Organization } from '../types/organization';
import type { Task } from '../types/task';
import type { User } from '../types/user';

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'taskflow_mock';

export interface MockStore {
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
            description: undefined,
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
            description: undefined,
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
            description: undefined,
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
            description: undefined,
            isDone: false,
            isPinned: false,
            createdAt: now,
            updatedAt: now,
        },
    ],
    membershipRequests: [],
};

export const load = (): MockStore => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as MockStore) : structuredClone(DEFAULT_STORE);
    } catch {
        return structuredClone(DEFAULT_STORE);
    }
};

export const save = (store: MockStore): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const uid = (): string => crypto.randomUUID();

// ---------------------------------------------------------------------------
// Reset
// ---------------------------------------------------------------------------

export const resetMockData = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
