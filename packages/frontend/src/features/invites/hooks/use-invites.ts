import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { invitesApi } from '../api/invites-api';
import { authQueryKey } from '@/features/auth/hooks/use-auth';

export function orgInvitesQueryKey(orgId: string) {
  return ['org-invites', orgId] as const;
}

export const myInvitesQueryKey = ['my-invites'] as const;

export function useOrgInvitesQuery(orgId: string) {
  return useSuspenseQuery({
    queryKey: orgInvitesQueryKey(orgId),
    queryFn: async () => {
      const data = await invitesApi.listOrgInvites(orgId);
      return data.invites;
    },
  });
}

export function useMyInvitesQuery() {
  return useSuspenseQuery({
    queryKey: myInvitesQueryKey,
    queryFn: async () => {
      const data = await invitesApi.getMyInvites();
      return data.invites;
    },
  });
}

export function useCreateInviteMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => invitesApi.createInvite(orgId, email),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orgInvitesQueryKey(orgId) });
    },
  });
}

export function useRevokeInviteMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => invitesApi.revokeInvite(orgId, inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orgInvitesQueryKey(orgId) });
    },
  });
}

export function useAcceptInviteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => invitesApi.acceptInvite(inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myInvitesQueryKey });
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
      await queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      await queryClient.invalidateQueries({ queryKey: ['org-requests'] });
    },
  });
}

export function useDeclineInviteMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inviteId: string) => invitesApi.declineInvite(inviteId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: myInvitesQueryKey });
    },
  });
}
