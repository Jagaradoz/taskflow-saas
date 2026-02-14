import { apiClient } from '@/lib/api-client';
import type { Membership } from '@/types/membership';

export const membersApi = {
  list: () => apiClient<{ members: Membership[] }>('/api/members'),
  remove: (membershipId: string) =>
    apiClient<{ message: string }>(`/api/members/${membershipId}`, {
      method: 'DELETE',
    }),
};

