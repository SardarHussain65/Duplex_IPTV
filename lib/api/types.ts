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

// ─── Favorites ───────────────────────────────────────────────────────────────

export interface FavoriteMetadata {
  Id?: string;
  name: string;
  logoUrl?: string; // Keep for compatibility if needed
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
  groupTitle?: string;
  type?: string;     // Generic type (LIVE, MOVIE, SERIES)
  contentType?: string; // Specific type from backend
  category?: string;
  genre?: string;
  seriesTitle?: string;
  releaseYear?: number | string;
  streamHash: string;
}

export interface Favorite {
  id: string;
  metadata: FavoriteMetadata;
  playlistId?: string;
  name?: string;
  type?: string;
}

export interface CreateFavoriteInput {
  playlistId: string;
  name: string;
  type: string;
  metadata: FavoriteMetadata;
}

export interface QueryFavoriteInput {
  playlistId: string;
  page?: number;
  limit?: number;
  type?: string;
}

export interface GetFavoritesResponse {
  getFavorites: {
    items: Favorite[];
    total: number;
    totalLive: number;
    totalMovies: number;
    totalSeries: number;
  };
}
