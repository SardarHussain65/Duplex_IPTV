import { useMutation, useQuery } from '@apollo/client';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { AUTOPLAY_TOGGLE } from '../mutations';
import { GET_AUTOPLAY_BY_PLAYLIST_ID } from '../queries';
import { 
  GetAutoplayResponse, 
  ToggleAutoplayResponse 
} from '../types';
import { useEffect } from 'react';
import { useTab } from '@/context/TabContext';

/**
 * Hook to manage autoplay settings.
 */
export function useAutoplay() {
  const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);
  const { setIsAutoplayEnabled } = useTab();

  /**
   * Fetch autoplay status for the active playlist.
   */
  const { data, loading, error, refetch } = useQuery<GetAutoplayResponse>(GET_AUTOPLAY_BY_PLAYLIST_ID, {
    variables: {
      playlistId: activePlaylistId || '',
    },
    skip: !activePlaylistId,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  // Sync with global TabContext when data is loaded
  useEffect(() => {
    if (data?.getAutoplayByPlaylistId) {
      setIsAutoplayEnabled(data.getAutoplayByPlaylistId.autoplay);
    }
  }, [data, setIsAutoplayEnabled]);

  /**
   * Toggle autoplay status.
   */
  const [toggleAutoplayMutation, { loading: isToggling }] = useMutation<ToggleAutoplayResponse>(AUTOPLAY_TOGGLE, {
    refetchQueries: [{ 
        query: GET_AUTOPLAY_BY_PLAYLIST_ID, 
        variables: { playlistId: activePlaylistId } 
    }],
  });

  const toggleAutoplay = async (autoplay: boolean) => {
    if (!activePlaylistId) {
      throw new Error('No active playlist selected');
    }

    try {
        const result = await toggleAutoplayMutation({
          variables: {
            autoplay,
            playlistId: activePlaylistId,
          },
        });
        
        if (result.data?.autoplayToggle) {
            setIsAutoplayEnabled(result.data.autoplayToggle.autoplay);
        }
        return result;
    } catch (err) {
        console.error('Error toggling autoplay:', err);
        throw err;
    }
  };

  return {
    autoplay: data?.getAutoplayByPlaylistId?.autoplay ?? false,
    loading,
    error,
    isToggling,
    toggleAutoplay,
    refetch,
  };
}
