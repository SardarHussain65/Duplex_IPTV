import { useQuery } from '@tanstack/react-query';
import { restClient } from '../restClient';

/**
 * Example hook demonstrating how to use TanStack Query with the restClient.
 * Use this as a template for future API integrations.
 */
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: () => restClient.get<any>('/'), // Replace with a real health endpoint if available
    // Example: only fetch once on mount for health checks
    staleTime: Infinity,
  });
}
