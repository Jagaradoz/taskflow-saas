import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { joinRequestsApi } from '../api/join-requests-api';
import { authQueryKey } from '@/features/auth/hooks/use-auth';

export function orgRequestsQueryKey(orgId: string) {
  return ['org-requests', orgId] as const;
}

export const myRequestsQueryKey = ['my-requests'] as const;

export function useOrgRequestsQuery(orgId: string) {
  return useSuspenseQuery({
    queryKey: orgRequestsQueryKey(orgId),
    queryFn: async () => {
      const data = await joinRequestsApi.listOrgRequests(orgId);
      return data.requests;
    },
  });
}

export function useMyRequestsQuery() {
  return useSuspenseQuery({
    queryKey: myRequestsQueryKey,
    queryFn: async () => {
      const data = await joinRequestsApi.getMyRequests();
      return data.requests;
    },
  });
}

export function useCreateJoinRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, message }: { slug: string; message?: string }) =>
      joinRequestsApi.createJoinRequest(slug, message),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myRequestsQueryKey });
    },
  });
}

export function useApproveRequestMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => joinRequestsApi.approveRequest(orgId, requestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orgRequestsQueryKey(orgId) });
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
      await queryClient.invalidateQueries({ queryKey: ['members', orgId] });
    },
  });
}

export function useRejectRequestMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => joinRequestsApi.rejectRequest(orgId, requestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orgRequestsQueryKey(orgId) });
    },
  });
}

export function useCancelRequestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (requestId: string) => joinRequestsApi.cancelMyRequest(requestId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myRequestsQueryKey });
    },
  });
}
