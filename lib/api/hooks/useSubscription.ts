import { useQuery } from '@apollo/client';
import { GET_DEVICE_SUBSCRIPTION } from '../queries';

export interface SubscriptionData {
    id: string;
    endDate: string;
    startDate: string;
    plan: {
        name: string;
    };
    status: string;
}

/**
 * Hook to fetch subscription details.
 * Uses the authenticated context from Apollo Client.
 */
export function useSubscription() {
    const { data, loading, error, refetch } = useQuery<{ getDeviceSubscription: SubscriptionData }>(
        GET_DEVICE_SUBSCRIPTION,
        {
            fetchPolicy: 'cache-and-network',
        }
    );

    return {
        subscription: data?.getDeviceSubscription,
        loading,
        error,
        refetch,
    };
}
