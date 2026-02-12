import type {
    MembershipRequest,
} from '../types/membership-request';
import { load, save, uid, type MockStore } from './store';

// Define MembershipRequestWithUser locally if it's not imported
export type MembershipRequestWithUser = Omit<
    MembershipRequest,
    'org' | 'inviter'
> & {
    user?: { name: string; email: string };
    inviter?: { name: string };
    org?: { name: string; slug: string };
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
        user: user ? { name: user.name, email: user.email } : undefined,
        ...(inviter ? { inviter: { name: inviter.name } } : {}),
        ...(org ? { org: { name: org.name, slug: org.slug } } : {}),
    };
};

// ---------------------------------------------------------------------------
// Membership Requests
// ---------------------------------------------------------------------------

export const mockMembershipRequests: MembershipRequest[] = [
    {
        id: 'req_1',
        orgId: 'org_1',
        type: 'invite',
        invitedUserId: 'user_2', // jane
        invitedBy: 'user_1', // john
        role: 'member',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

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
    email: string,
    invitedByUserId: string,
): boolean => {
    const store = load();
    const target = store.users.find((u) => u.email === email);
    if (!target) return false; // For mock, simply ignore if user doesn't exist

    const ts = new Date().toISOString();
    const req: MembershipRequest = {
        id: uid(),
        orgId,
        type: 'invite',
        invitedUserId: target.id,
        invitedBy: invitedByUserId,
        requesterId: undefined,
        role: 'member',
        status: 'pending',
        message: undefined,
        createdAt: ts,
        updatedAt: ts,
        resolvedAt: undefined,
        resolvedBy: undefined,
    };
    store.membershipRequests.push(req);
    save(store);
    return true;
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
        invitedUserId: undefined,
        invitedBy: undefined,
        requesterId,
        role: 'member',
        status: 'pending',
        message: message ?? undefined,
        createdAt: ts,
        updatedAt: ts,
        resolvedAt: undefined,
        resolvedBy: undefined,
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
