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

export const GET_WATCH_HISTORY = gql`
  query GetWatchHistory($filters: QueryWatchHistoryInput!) {
    getWatchHistory(filters: $filters) {
      items {
        id
        name
        metadata
        duration
        currentTime
        watchedPercent
        type
        isCompleted
        lastWatchedAt
        externalId
        createdAt
        updatedAt
      }
      total
      totalLive
      totalMovies
      totalSeries
    }
  }
`;

export const GET_PARENTAL_CONTROLS = gql`
  query GetParentalControls($filters: QueryParentalControlInput!) {
    getParentalControls(filters: $filters) {
       items {
        metadata
        id
        type
        playlistId
      }
      total
      totalLive
      totalMovies
      totalSeries
    }
  }
`;

export const GET_AUTOPLAY_BY_PLAYLIST_ID = gql`
  query GetAutoplayByPlaylistId($playlistId: String!) {
    getAutoplayByPlaylistId(playlistId: $playlistId) {
      autoplay
      playlistId
    }
  }
`;

export const GET_TOGGLE_PARENTAL_CONTROL = gql`
  query GetToggleParentalControl($playlistId: ID!) {
    getToggleParentalControl(playlistId: $playlistId) {
      id
      isRestricted
      pin
    }
  }
`;
