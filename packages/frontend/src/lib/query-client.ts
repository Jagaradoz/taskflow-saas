import { QueryClient } from '@tanstack/react-query';
import { setOnUnauthorized } from '@/lib/api-client';
import { authQueryKey } from '@/features/auth/hooks/use-auth';
import { notifyError } from '@/lib/notifications';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
      throwOnError: true,
    },
    mutations: {
      onError: (error) => {
        notifyError(error);
      },
    },
  },
});

/** On 401, clear the auth cache so ProtectedRoute redirects to /login. */
setOnUnauthorized(() => {
  queryClient.setQueryData(authQueryKey, null);
});
