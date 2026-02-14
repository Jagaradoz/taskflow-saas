import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { membersApi } from '../api/members-api';

export function membersQueryKey(orgId: string) {
  return ['members', orgId] as const;
}

export function useMembersQuery(orgId: string) {
  return useSuspenseQuery({
    queryKey: membersQueryKey(orgId),
    queryFn: async () => {
      const data = await membersApi.list();
      return data.members;
    },
  });
}

export function useRemoveMemberMutation(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (membershipId: string) => membersApi.remove(membershipId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: membersQueryKey(orgId) });
    },
  });
}
