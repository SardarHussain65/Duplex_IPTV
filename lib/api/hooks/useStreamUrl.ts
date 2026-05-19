import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';
import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { restClient } from '../restClient';


interface StreamResponse {
  url: string;
}

/**
 * Hook to fetch the real video stream URL using the streamHash.
 * Endpoint: GET /playlists/stream/{streamHash}
 */
export function useStreamUrl(streamHash: string | null, enabled: boolean = true) {
  const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);

  return useQuery({
    queryKey: ['stream-url', activePlaylistId, streamHash],
    queryFn: async () => {
      if (!streamHash || !activePlaylistId) {
        console.log('[useStreamUrl] Missing streamHash or activePlaylistId');
        return null;
      }

      // If the streamHash already contains a colon, it likely already is in 'playlistId:hash' format.
      const fullId = streamHash.includes(':') ? streamHash : `${activePlaylistId}:${streamHash}`;
      const path = `/playlists/stream/${fullId}/raw`;

      
      try {
        // We call the API to ensure the backend processes the resolution/tracking
        // Since it's a "raw" stream endpoint, we use restClient which adds Auth headers.
        // We only care about the URL for the player, so we return it.
        const response = await restClient.get<any>(path, { timeout: 30_000 });
        
        // If the backend returns a JSON with an actual playable URL, use it.
        // Otherwise, use the original /raw URL.
        const resolvedUrl = (typeof response === 'object' && response?.url) ? response.url : `${API_BASE_URL}${path}`;
        
        console.log(`[useStreamUrl] Resolved URL for ${fullId}:`, resolvedUrl);
        return resolvedUrl;
      } catch (error) {
        console.error(`[useStreamUrl] Failed to call resolution API for ${fullId}:`, error);
        // Fallback to the known raw URL even if the resolution call failed
        return `${API_BASE_URL}${path}`;
      }
    },
    enabled: !!streamHash && !!activePlaylistId && enabled,
    staleTime: 5 * 60 * 1000, // Reduced staleTime to ensure fresh resolution sessions
  });
}