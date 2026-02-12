import type { MemberWithUser } from '../types/membership';
import { load, save } from './store';

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
