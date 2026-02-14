import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/types/api';
import type { MemberRole } from '@/types/membership';

export interface AuthMembership {
  id: string;
  orgId: string;
  orgName: string;
  orgSlug: string;
  role: MemberRole;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  memberships: AuthMembership[];
}

export interface AuthMeResponse {
  user: AuthUser;
  currentOrgId?: string;
}

interface AuthPayload {
  email: string;
  password: string;
}

interface RegisterPayload extends AuthPayload {
  name: string;
}

export const authApi = {
  login: (payload: AuthPayload) =>
    apiClient<{ user: Pick<AuthUser, 'id' | 'email' | 'name'> }>('/api/auth/login', {
      method: 'POST',
      body: payload,
    }),

  register: (payload: RegisterPayload) =>
    apiClient<{ user: Pick<AuthUser, 'id' | 'email' | 'name'> }>('/api/auth/register', {
      method: 'POST',
      body: payload,
    }),

  logout: () =>
    apiClient<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    }),

  me: async () => {
    try {
      return await apiClient<AuthMeResponse>('/api/auth/me');
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        return null;
      }
      throw error;
    }
  },
};
