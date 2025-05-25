import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3600000,
      gcTime: 3600000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
