import { useQuery } from '@apollo/client';
import { GENERATE_DEVICE_ID } from '../queries';

/**
 * Hook to fetch a unique device ID from the GraphQL API.
 * 
 * Returns:
 * - deviceId: string | undefined
 * - loading: boolean
 * - error: ApolloError | undefined
 */
export function useGenerateDeviceId() {
  const { data, loading, error } = useQuery(GENERATE_DEVICE_ID);

  return {
    deviceId: data?.generateDeviceId,
    loading,
    error,
  };
}
