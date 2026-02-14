import { apiClient } from '@/lib/api-client';
import type { MembershipRequestWithUser } from '@/types/membership-request';

export const invitesApi = {
  listOrgInvites: (orgId: string) =>
    apiClient<{ invites: MembershipRequestWithUser[] }>(`/api/orgs/${orgId}/invites`),

  createInvite: (orgId: string, email: string) =>
    apiClient<{ invite: MembershipRequestWithUser }>(`/api/orgs/${orgId}/invites`, {
      method: 'POST',
      body: { email, role: 'member' },
    }),

  revokeInvite: (orgId: string, inviteId: string) =>
    apiClient<{ message: string }>(`/api/orgs/${orgId}/invites/${inviteId}`, {
      method: 'DELETE',
    }),

  getMyInvites: () => apiClient<{ invites: MembershipRequestWithUser[] }>('/api/me/invites'),

  acceptInvite: (inviteId: string) =>
    apiClient<{ membership: unknown }>(`/api/me/invites/${inviteId}/accept`, {
      method: 'POST',
    }),

  declineInvite: (inviteId: string) =>
    apiClient<{ message: string }>(`/api/me/invites/${inviteId}/decline`, {
      method: 'POST',
    }),
};

