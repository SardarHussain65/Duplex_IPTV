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

// ─── Watch History ────────────────────────────────────────────────────────────

export interface WatchHistoryMetadata {
  name: string;
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string | null;
  groupTitle?: string;
  contentType?: string;
  category?: string;
  genre?: string;
  releaseYear?: number | null;
  streamHash?: string | null;
}

/** Input for the saveWatchHistory mutation */
export interface CreateWatchHistoryInput {
  playlistId: string;
  name: string;
  externalId: string;
  type: 'LIVE' | 'MOVIE' | 'SERIES';
  metadata: WatchHistoryMetadata;
  /** 0 for LIVE channels — backend expects Int! */
  duration: number;
  /** 0 for LIVE channels — backend expects Int! */
  currentTime: number;
}

/** Filters for the getWatchHistory query */
export interface QueryWatchHistoryInput {
  playlistId: string;
  page?: number;
  limit?: number;
  type?: 'LIVE' | 'MOVIE' | 'SERIES';
}

/** Single item returned by getWatchHistory */
export interface WatchHistoryItem {
  id: string;
  name: string;
  metadata: WatchHistoryMetadata;
  /** Total duration in seconds — null for LIVE */
  duration: number | null;
  /** Last saved playback position in seconds — null for LIVE */
  currentTime: number | null;
  /** 0–100, server-computed — null for LIVE */
  watchedPercent: number | null;
  type: 'LIVE' | 'MOVIE' | 'SERIES';
  isCompleted: boolean;
  externalId: string;
  lastWatchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetWatchHistoryResponse {
  getWatchHistory: {
    items: WatchHistoryItem[];
    total: number;
    totalLive: number;
    totalMovies: number;
    totalSeries: number;
  };
}

export interface ClearWatchHistoryResponse {
  clearWatchHistory: boolean;
}
