import { gql } from '@apollo/client';

export const GENERATE_DEVICE_ID = gql`
  mutation GenerateDeviceId($input: GenerateDeviceIdInput!) {
    generateDeviceId(input: $input) {
      device {
        id
        hasUsedTrial
        isTrial
        deviceKey
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
    }
  }
`;
