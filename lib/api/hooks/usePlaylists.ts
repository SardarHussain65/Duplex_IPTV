import { useQuery } from '@apollo/client';
import { GET_PLAYLISTS_BY_DEVICE } from '../queries';
import { GetPlaylistsByDeviceResponse } from '../types';

interface UsePlaylistsOptions {
  deviceId: string;
  limit?: number;
  page?: number;
  name?: string;
}

export function usePlaylists({ deviceId, limit = 10, page = 1, name }: UsePlaylistsOptions) {
  const { data, loading, error, refetch } = useQuery<GetPlaylistsByDeviceResponse>(
    GET_PLAYLISTS_BY_DEVICE,
    {
      variables: {
        deviceId,
        limit,
        page,
        name,
      },
      skip: !deviceId,
    }
  );

  return {
    playlists: data?.getPlaylistsByDevice?.items || [],
    loading,
    error,
    refetch,
  };
}
