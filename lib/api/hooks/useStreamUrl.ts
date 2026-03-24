import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '../config';

interface StreamResponse {
  url: string;
}

/**
 * Hook to fetch the real video stream URL using the streamHash.
 * Endpoint: GET /playlists/stream/{streamHash}
 */
export function useStreamUrl(streamHash: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ['stream-url', streamHash],
    queryFn: () => {
      if (!streamHash) return null;
      return `${API_BASE_URL}/playlists/stream/${streamHash}/raw`;
    },
    enabled: !!streamHash && enabled,
    staleTime: 60 * 60 * 1000,
  });
}