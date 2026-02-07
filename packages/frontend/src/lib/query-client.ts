import { QueryClient } from '@tanstack/react-query';
import { setOnUnauthorized } from '@/lib/api-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** On 401, clear the auth cache so ProtectedRoute redirects to /login. */
setOnUnauthorized(() => {
  queryClient.setQueryData(['auth', 'me'], null);
  queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
});
