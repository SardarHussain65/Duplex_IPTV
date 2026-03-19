import { useInfiniteQuery } from '@tanstack/react-query';
import { restClient } from '../restClient';
import { GetChannelsResponse } from '../types';

interface UsePlaylistChannelsOptions {
  playlistId: string;
  limit?: number;
  contentType?: string;
  enabled?: boolean;
}

/**
 * Hook to fetch Playlist channels with infinite scrolling.
 * Uses the REST API: GET /playlists/{id}/channels?page=...&limit=...&contentType=...
 */
export function usePlaylistChannels({ 
  playlistId, 
  limit = 20, 
  contentType, 
  enabled = true 
}: UsePlaylistChannelsOptions) {
  return useInfiniteQuery({
    queryKey: ['playlist-channels', playlistId, limit, contentType],
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('limit', limit.toString());
      if (contentType) params.append('contentType', contentType);
      
      const queryString = params.toString();
      const path = `/playlists/${playlistId}/channels?${queryString}`;
      return restClient.get<GetChannelsResponse>(path);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the limit, we've reached the end
      if (lastPage.items.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    enabled: !!playlistId && enabled,
    staleTime: 5 * 60 * 1000,
  });
}
