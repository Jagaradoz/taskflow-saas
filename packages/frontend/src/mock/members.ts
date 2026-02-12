import type { Membership } from '../types/membership';
import { load, save } from './store';

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export const getMembersByOrg = (orgId: string): Membership[] => {
    const store = load();
    return store.memberships
        .filter((m) => m.orgId === orgId)
        .map((m) => {
            const user = store.users.find((u) => u.id === m.userId)!;
            // Need to return full user object or cast as User.
            // Since this is mock, providing partial is risky if type is strict.
            // But let's assume partial for now or update later if needed.
            // Actually, if User interface requires more fields, this will error.
            return { ...m, user: user };
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
