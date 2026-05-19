import { useQuery } from '@tanstack/react-query';
import { restClient } from '../restClient';
import { GetCategoriesResponse } from '../types';

interface UseCategoriesOptions {
  playlistId: string;
  contentType: string;
  enabled?: boolean;
}

/**
 * Hook to fetch channel categories for a specific playlist and content type.
 * Path: /playlists/{id}/channels/categories?contentType=...
 */
export function useCategories({
  playlistId,
  contentType,
  enabled = true
}: UseCategoriesOptions) {
  return useQuery({
    queryKey: ['playlist-categories', playlistId, contentType],
    queryFn: () => {
      const path = `/playlists/${playlistId}/channels/categories?contentType=${contentType}`;
      return restClient.get<GetCategoriesResponse>(path);
    },
    enabled: !!playlistId && enabled,
    staleTime: 10 * 60 * 1000, // Categories don't change often
  });
}
