import { gql } from '@apollo/client';

export const PLAYLIST_SYNC_UPDATED = gql`
  subscription PlaylistSyncUpdated($deviceId: String!) {
    playlistSyncUpdated(deviceId: $deviceId) {
      channelCount
      deviceId
      errorCode
      message
      playlistId
      stage
      updatedAt
    }
  }
`;
