import type { Organization } from '../types/organization';
import { load, save, uid } from './store';

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
        description: description ?? undefined,
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
