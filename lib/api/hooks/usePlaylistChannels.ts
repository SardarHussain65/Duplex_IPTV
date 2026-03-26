import { useInfiniteQuery } from '@tanstack/react-query';
import { restClient } from '../restClient';
import { GetChannelsResponse } from '../types';

interface UsePlaylistChannelsOptions {
  playlistId: string;
  limit?: number;
  contentType?: string;
  search?: string;
  enabled?: boolean;
}

/**
 * Hook to fetch Playlist channels with infinite scrolling.
 * Uses the REST API: GET /playlists/{id}/channels?page=...&limit=...&contentType=...&search=...
 * Search is handled by the backend — pass a debounced query string to trigger a new fetch.
 */
export function usePlaylistChannels({
  playlistId,
  limit = 20,
  contentType,
  search,
  enabled = true
}: UsePlaylistChannelsOptions) {
  return useInfiniteQuery({
    queryKey: ['playlist-channels', playlistId, limit, contentType, search ?? ''],
    queryFn: ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('limit', limit.toString());
      if (contentType) params.append('contentType', contentType);
      if (search && search.trim()) params.append('search', search.trim());

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
