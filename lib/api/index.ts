/**
 * lib/api/index.ts
 * Barrel export — single entry point for all API layer imports.
 *
 * Usage:
 *   import { restClient, apolloClient } from '@/lib/api';
 */

// ─── Core Clients ──────────────────────────────────────────────────────────────
export * from './config';
export { apolloClient } from './graphqlClient';
export * from './mutations';
export { queryClient } from './queryClient';
export { ApiRequestError, restClient } from './restClient';
export { tokenStorage } from './tokenStorage';

// ─── Hooks ─────────────────────────────────────────────────────────────────────
export { useGenerateDeviceId } from './hooks/useGenerateDeviceId';
export { useHealthCheck } from './hooks/useHealthCheck';
export { usePlaylistChannels } from './hooks/usePlaylistChannels';
export { useStreamUrl } from './hooks/useStreamUrl';
export { useFavorites } from './hooks/useFavorites';
export { useWatchHistory } from './hooks/useWatchHistory';
export type { WatchableItem, VideoPlayerRef } from './hooks/useWatchHistory';
export * from './types';

