import { useEffect } from 'react';
import { useSubscription as useApolloSubscription } from '@apollo/client';
import { PLAYLIST_SYNC_UPDATED } from '../subscriptions';
import { PlaylistSyncUpdatedPayload, PlaylistSyncUpdatedVariables } from '../types';

export function usePlaylistSyncSubscription(
  deviceId: string,
  onUpdate?: (data: PlaylistSyncUpdatedPayload['playlistSyncUpdated']) => void
) {
  const result = useApolloSubscription<PlaylistSyncUpdatedPayload, PlaylistSyncUpdatedVariables>(
    PLAYLIST_SYNC_UPDATED,
    {
      variables: { deviceId },
    }
  );

  useEffect(() => {
    if (result.data?.playlistSyncUpdated && onUpdate) {
      onUpdate(result.data.playlistSyncUpdated);
    }
  }, [result.data, onUpdate]);

  return result;
}
