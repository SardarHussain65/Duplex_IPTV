import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient instance for TanStack Query.
 * Configured with sensible defaults for a mobile IPTV app.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 1 minute
      staleTime: 60 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests up to 2 times
      retry: 2,
      // Refetch on window focus (or app resume in React Native)
      refetchOnWindowFocus: true,
    },
  },
});
