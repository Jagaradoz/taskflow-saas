import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { authApi, type AuthMeResponse } from '../api/auth-api';

export const authQueryKey = ['auth', 'me'] as const;

export function useAuthQuery() {
  return useSuspenseQuery({
    queryKey: authQueryKey,
    queryFn: authApi.me,
    staleTime: 1000 * 30,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      queryClient.setQueryData<AuthMeResponse | null>(authQueryKey, null);
      await queryClient.invalidateQueries({ queryKey: authQueryKey });
    },
  });
}
