import { apiClient } from '@/lib/api-client';
import type { MembershipRequestWithUser } from '@/types/membership-request';

export const joinRequestsApi = {
  createJoinRequest: (slug: string, message?: string) =>
    apiClient<{ request: MembershipRequestWithUser }>(`/api/orgs/${slug}/requests`, {
      method: 'POST',
      body: { message },
    }),

  listOrgRequests: (orgId: string) =>
    apiClient<{ requests: MembershipRequestWithUser[] }>(`/api/orgs/${orgId}/requests`),

  approveRequest: (orgId: string, requestId: string) =>
    apiClient<{ membership: unknown }>(`/api/orgs/${orgId}/requests/${requestId}/approve`, {
      method: 'POST',
      body: { role: 'member' },
    }),

  rejectRequest: (orgId: string, requestId: string) =>
    apiClient<{ message: string }>(`/api/orgs/${orgId}/requests/${requestId}/reject`, {
      method: 'POST',
    }),

  getMyRequests: () => apiClient<{ requests: MembershipRequestWithUser[] }>('/api/me/requests'),

  cancelMyRequest: (requestId: string) =>
    apiClient<{ message: string }>(`/api/me/requests/${requestId}`, {
      method: 'DELETE',
    }),
};

