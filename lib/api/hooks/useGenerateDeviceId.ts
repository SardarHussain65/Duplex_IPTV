import { useMutation } from '@apollo/client';
import { useDeviceStore } from '../../store/useDeviceStore';
import { GENERATE_DEVICE_ID } from '../mutations';
import { tokenStorage } from '../tokenStorage';

/**
 * Hook to trigger device ID generation and store trial status.
 */
export function useGenerateDeviceId() {
  const setDeviceData = useDeviceStore((state) => state.setDeviceData);

  const [generateDeviceIdMutation, { data, loading, error }] = useMutation(GENERATE_DEVICE_ID, {
    onCompleted: async (data) => {
      const result = data?.generateDeviceId;
      if (result) {
        // 1. Store auth tokens securely
        if (result.accessToken && result.refreshToken) {
          await tokenStorage.setTokens(result.accessToken, result.refreshToken);
        }

        // 2. Update device and subscription state
        if (result.device) {
          const isBlocked = result.subscription?.status === 'blocked' || result.subscription?.status === 'blocked_device';
          setDeviceData({
            id: result.device.id,
            deviceKey: result.device.deviceKey,
            deviceStatus: result.device.status,
            hasUsedTrial: result.device.hasUsedTrial,
            isTrial: result.device.isTrial,
            isBlocked: isBlocked,
            subscription: result.subscription,
          });
        }
      }
    },
  });

  const generateDeviceId = (macAddress: string) => {
    return generateDeviceIdMutation({
      variables: {
        input: { macAddress },
      },
    });
  };

  return {
    generateDeviceId,
    deviceId: data?.generateDeviceId?.device?.id,
    deviceKey: data?.generateDeviceId?.device?.deviceKey,
    loading,
    error,
  };
}
