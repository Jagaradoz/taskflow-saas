import { apiClient } from '@/lib/api-client';
import type { Organization } from '@/types/organization';

interface CreateOrganizationInput {
  name: string;
  description?: string;
}

interface UpdateOrganizationInput {
  name?: string;
  description?: string;
}

export const orgsApi = {
  create: (payload: CreateOrganizationInput) =>
    apiClient<{ organization: Organization }>('/api/orgs', {
      method: 'POST',
      body: payload,
    }),

  getById: (orgId: string) =>
    apiClient<{ organization: Organization }>(`/api/orgs/${orgId}`),

  update: (orgId: string, payload: UpdateOrganizationInput) =>
    apiClient<{ organization: Organization }>(`/api/orgs/${orgId}`, {
      method: 'PATCH',
      body: payload,
    }),

  delete: (orgId: string) =>
    apiClient<{ message: string }>(`/api/orgs/${orgId}`, {
      method: 'DELETE',
    }),

  switch: (orgId: string) =>
    apiClient<{ organization: Organization; message: string }>(`/api/orgs/${orgId}/switch`, {
      method: 'POST',
    }),
};

