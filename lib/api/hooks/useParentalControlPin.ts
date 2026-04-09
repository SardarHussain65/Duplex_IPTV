import { useMutation, useQuery } from '@apollo/client';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { SET_PARENTAL_CONTROL_PIN, TOGGLE_PARENTAL_CONTROL, VERIFY_PARENTAL_CONTROL_PIN } from '../mutations';
import { GET_TOGGLE_PARENTAL_CONTROL } from '../queries';
import {
  GetToggleParentalControlResponse,
  SetParentalControlPinResponse,
  ToggleParentalControlResponse,
  VerifyParentalControlPinResponse,
} from '../types';

export function useParentalControlPin() {
  const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);

  const {
    data: toggleData,
    loading: toggleLoading,
    refetch: refetchToggle,
  } = useQuery<GetToggleParentalControlResponse>(GET_TOGGLE_PARENTAL_CONTROL, {
    variables: { playlistId: activePlaylistId || '' },
    skip: !activePlaylistId,
    fetchPolicy: 'cache-and-network',
  });

  const isRestricted = toggleData?.getToggleParentalControl?.isRestricted ?? false;
  // null response means no PIN has ever been set for this playlist
  const hasPinEverBeenSet = toggleData?.getToggleParentalControl != null;

  const [setPinMutation, { loading: isSettingPin, error: setPinError }] = useMutation<SetParentalControlPinResponse>(SET_PARENTAL_CONTROL_PIN);
  const [verifyPinMutation, { loading: isVerifyingPin, error: verifyPinError }] = useMutation<VerifyParentalControlPinResponse>(VERIFY_PARENTAL_CONTROL_PIN);
  const [toggleMutation, { loading: isToggling }] = useMutation<ToggleParentalControlResponse>(TOGGLE_PARENTAL_CONTROL, {
    refetchQueries: [{ query: GET_TOGGLE_PARENTAL_CONTROL, variables: { playlistId: activePlaylistId || '' } }],
  });

  const setPin = async (pin: string) => {
    if (!activePlaylistId) {
      throw new Error('No active playlist selected');
    }

    try {
      const result = await setPinMutation({
        variables: {
          input: {
            pin,
            playlistId: activePlaylistId,
          },
        },
      });
      await refetchToggle();
      return result.data?.setParentalControlPin ?? false;
    } catch (err) {
      console.error('Error setting parental control pin:', err);
      throw err;
    }
  };

  const verifyPin = async (pin: string) => {
    if (!activePlaylistId) {
      throw new Error('No active playlist selected');
    }

    try {
      const result = await verifyPinMutation({
        variables: {
          input: {
            pin,
            playlistId: activePlaylistId,
          },
        },
      });
      return result.data?.verifyParentalControlPin ?? false;
    } catch (err) {
      console.error('Error verifying parental control pin:', err);
      throw err;
    }
  };

  const toggleParentalControl = async () => {
    if (!activePlaylistId) throw new Error('No active playlist selected');
    try {
      const result = await toggleMutation({
        variables: { playlistId: activePlaylistId },
      });
      return result.data?.toggleParentalControl;
    } catch (err) {
      console.error('Error toggling parental control:', err);
      throw err;
    }
  };

  return {
    isRestricted,
    hasPinEverBeenSet,
    toggleLoading,
    refetchToggle,
    setPin,
    isSettingPin,
    setPinError,
    verifyPin,
    isVerifyingPin,
    verifyPinError,
    toggleParentalControl,
    isToggling,
  };
}

