import { useMutation } from '@apollo/client';
import { VERIFY_PLAYLIST_PIN } from '../mutations';
import { VerifyPlaylistPinInput } from '../types';

export function useVerifyPlaylistPin() {
  const [verifyPinMutation, { loading, error }] = useMutation<{
    verifyPlaylistPin: boolean;
  }, {
    input: VerifyPlaylistPinInput;
  }>(VERIFY_PLAYLIST_PIN);

  const verifyPin = async (playlistId: string, pin: string) => {
    try {
      const result = await verifyPinMutation({
        variables: {
          input: { playlistId, pin },
        },
      });
      return result.data?.verifyPlaylistPin || false;
    } catch (err) {
      console.error('Error verifying playlist PIN:', err);
      return false;
    }
  };

  return {
    verifyPin,
    loading,
    error,
  };
}
