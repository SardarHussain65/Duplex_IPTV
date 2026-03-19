/**
 * API Response Types
 * Typed contracts for all REST and GraphQL API calls.
 */

// ─── Generic Wrappers ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// ─── Playlists ───────────────────────────────────────────────────────────────

export interface CreatePlaylistInput {
  deviceId: string;
  isPinRequired: boolean;
  name: string;
  type: string;
  url: string;
  username?: string;
  password?: string;
}

export interface Playlist {
  id: string;
  name: string;
  url: string;
  isPinRequired: boolean;
}

export interface VerifyPlaylistPinInput {
  pin: string;
  playlistId: string;
}

export interface GetPlaylistsByDeviceResponse {
  getPlaylistsByDevice: {
    items: Playlist[];
  };
}

// ─── Channels ────────────────────────────────────────────────────────────────

export interface Channel {
  name: string;
  tvgId: string;
  tvgName: string;
  tvgLogo: string;
  groupTitle: string;
  contentType: string;
  category: string;
  genre: string;
  streamHash: string;
}

export interface GetChannelsResponse {
  items: Channel[];
}
