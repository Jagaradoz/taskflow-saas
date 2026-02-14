import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { orgsApi } from '../api/orgs-api';
import { authQueryKey } from '@/features/auth/hooks/use-auth';

export function orgQueryKey(orgId: string) {
  return ['orgs', orgId] as const;
}

export function useListOrganizationsQuery(query?: string) {
  return useQuery({
    queryKey: ['orgs', 'list', query ?? ''],
    queryFn: async () => {
      const data = await orgsApi.list(query);
      return data.organizations;
    },
  });
}

export function useOrganizationQuery(orgId: string) {
  return useSuspenseQuery({
    queryKey: orgQueryKey(orgId),
    queryFn: async () => {
      const data = await orgsApi.getById(orgId);
      return data.organization;
    },
  });
}

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: orgsApi.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}

export function useUpdateOrganizationMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name?: string; description?: string }) => orgsApi.update(orgId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orgQueryKey(orgId) });
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}

export function useDeleteOrganizationMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => orgsApi.delete(orgId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
      await queryClient.removeQueries({ queryKey: orgQueryKey(orgId) });
    },
  });
}

export function useSwitchOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orgId: string) => orgsApi.switch(orgId),
    onSuccess: async (_data, orgId) => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
      await queryClient.invalidateQueries({ queryKey: orgQueryKey(orgId) });
      await queryClient.invalidateQueries({ queryKey: ['tasks', orgId] });
      await queryClient.invalidateQueries({ queryKey: ['members', orgId] });
    },
  });
}
