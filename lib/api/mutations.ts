import { gql } from '@apollo/client';


export const GENERATE_DEVICE_ID = gql`
  mutation GenerateDeviceId($input: GenerateDeviceIdInput!) {
    generateDeviceId(input: $input) {
      device {
        id
        hasUsedTrial
        isTrial
        deviceKey
        status
      }
      subscription {
        id
        startDate
        endDate
        status
      }
      refreshToken
      accessToken
    }
  }
`;

export const REFRESH_TOKEN_MOBILE = gql`
  mutation RefreshTokenMobile($refreshToken: String!) {
    refreshTokenMobile(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`;

export const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist($input: CreatePlaylistInput!) {
    createPlaylist(input: $input) {
      deviceId
      name
      pin
      id
    }
  }
`;

export const VERIFY_PLAYLIST_PIN = gql`
  mutation VerifyPlaylistPin($input: VerifyPlaylistPinInput!) {
    verifyPlaylistPin(input: $input)
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($input: CreateFavoriteInput!) {
    addFavorite(input: $input) {
      deviceId
      id
      name
      type
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($removeFavoriteId: ID!) {
    removeFavorite(id: $removeFavoriteId)
  }
`;

export const SAVE_WATCH_HISTORY = gql`
  mutation SaveWatchHistory($input: CreateWatchHistoryInput!) {
    saveWatchHistory(input: $input) {
      id
      name
      metadata
    }
  }
`;

export const CLEAR_WATCH_HISTORY = gql`
  mutation ClearWatchHistory($playlistId: ID!, $type: ContentType) {
    clearWatchHistory(playlistId: $playlistId, type: $type)
  }
`;

export const ADD_PARENTAL_CONTROL = gql`
  mutation AddParentalControl($input: CreateParentalControlInput!) {
    addParentalControl(input: $input) {
      deviceId
      id
      name
      type
    }
  }
`;

export const REMOVE_PARENTAL_CONTROL = gql`
  mutation RemoveParentalControl($removeParentalControlId: ID!) {
    removeParentalControl(id: $removeParentalControlId)
  }
`;
