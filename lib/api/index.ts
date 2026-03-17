/**
 * lib/api/index.ts
 * Barrel export — single entry point for all API layer imports.
 *
 * Usage:
 *   import { restClient, apolloClient } from '@/lib/api';
 */

// ─── Core Clients ──────────────────────────────────────────────────────────────
export { queryClient } from './queryClient';
export { apolloClient } from './graphqlClient';
export { ApiRequestError, restClient } from './restClient';
export { tokenStorage } from './tokenStorage';
export * from './queries';
export * from './config';

// ─── Hooks ─────────────────────────────────────────────────────────────────────
export { useHealthCheck } from './hooks/useHealthCheck';
export { useGenerateDeviceId } from './hooks/useGenerateDeviceId';
export * from './types';
