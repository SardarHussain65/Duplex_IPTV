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

export const GET_DEVICE_SUBSCRIPTION = gql`
  query GeDeviceSubscription {
    getDeviceSubscription {
      endDate
      startDate
      id
      plan {
        name
      }
      status
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($filters: QueryFavoriteInput!) {
    getFavorites(filters: $filters) {
      items {
        metadata
        id
      }
      total
      totalLive
      totalMovies
      totalSeries
    }
  }
`;
