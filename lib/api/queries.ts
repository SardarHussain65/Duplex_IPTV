import { gql } from '@apollo/client';

export const GET_PLAYLISTS_BY_DEVICE = gql`
  query GetPlaylistsByDevice($deviceId: String!, $limit: Float!, $name: String, $page: Float!) {
    getPlaylistsByDevice(deviceId: $deviceId, limit: $limit, name: $name, page: $page) {
      items {
        id
        name
        url
        isPinRequired
      }
    }
  }
`;
