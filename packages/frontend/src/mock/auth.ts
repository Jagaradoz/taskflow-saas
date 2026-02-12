import type { User } from '../types/user';
import type { MemberRole } from '../types/membership';
import { load, save, uid, type MockStore } from './store';

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
