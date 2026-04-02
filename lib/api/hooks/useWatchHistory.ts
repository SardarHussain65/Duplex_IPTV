/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — useWatchHistory Hook
 *
 *  Mirrors the useFavorites pattern:
 *  - saveHistory()              → saveWatchHistory mutation (on play start)
 *  - startProgressTracking()   → saves every 2 min for VOD/SERIES only
 *  - stopProgressTracking()    → clears the interval on unmount
 *  - useGetWatchHistory()      → paginated getWatchHistory query
 *
 *  LIVE rule: duration & currentTime are always null — never tracked.
 * ─────────────────────────────────────────────────────────────
 */

import { useDeviceStore } from '@/lib/store/useDeviceStore';
import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useRef } from 'react';
import { CLEAR_WATCH_HISTORY, SAVE_WATCH_HISTORY } from '../mutations';
import { GET_WATCH_HISTORY } from '../queries';
import {
  ClearWatchHistoryResponse,
  CreateWatchHistoryInput,
  GetWatchHistoryResponse,
  QueryWatchHistoryInput,
  WatchHistoryMetadata,
} from '../types';

// ── 2-minute interval (milliseconds) ─────────────────────────
const PROGRESS_INTERVAL_MS = 2 * 60 * 1000; // 2 minutes

// ── Shape of a channel/content item passed into the hook ─────
export interface WatchableItem {
  /** Unique identifier — used as externalId */
  streamHash: string;
  name: string;
  type: 'LIVE' | 'MOVIE' | 'SERIES';
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
  groupTitle?: string;
  contentType?: string;
  category?: string;
  genre?: string;
  releaseYear?: number | string | null;
}

// ── expo-video player shape (only the fields we need) ────────
export interface VideoPlayerRef {
  currentTime: number;   // seconds
  duration: number;      // seconds (0 while loading)
}

export function useWatchHistory() {
  const activePlaylistId = useDeviceStore((state) => state.activePlaylistId);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [saveWatchHistoryMutation] = useMutation(SAVE_WATCH_HISTORY);

  // ── Build the mutation input ─────────────────────────────────
  // Single source of truth for the nullable LIVE logic.
  const buildInput = useCallback(
    (
      item: WatchableItem,
      currentTimeSec: number,
      totalDurationSec?: number | null
    ): CreateWatchHistoryInput => {
      const isLive = item.type === 'LIVE';

      const metadata: WatchHistoryMetadata = {
        name: item.name,
        tvgId: item.tvgId ?? '',
        tvgName: item.tvgName ?? item.name,
        tvgLogo: item.tvgLogo ?? null,
        groupTitle: item.groupTitle ?? '',
        contentType: item.contentType ?? item.type,
        category: item.category ?? item.groupTitle ?? '',
        genre: item.genre ?? item.groupTitle ?? '',
        releaseYear: item.releaseYear ? Number(item.releaseYear) : null,
        streamHash: item.streamHash,
      };

      return {
        playlistId: activePlaylistId ?? '',
        name: item.name,
        externalId: item.streamHash,
        type: item.type,
        metadata,
        // KEY: LIVE channels backend expects Int!, so we pass 0
        duration: isLive ? 0 : Math.floor(totalDurationSec ?? 0),
        currentTime: isLive ? 0 : Math.floor(currentTimeSec),
      };
    },
    [activePlaylistId]
  );

  // ── Save a single history entry ──────────────────────────────
  // Never throws — history failure should never crash the player.
  const saveHistory = useCallback(
    async (
      item: WatchableItem,
      currentTimeSec: number,
      totalDurationSec?: number | null
    ) => {
      if (!activePlaylistId) return;

      try {
        await saveWatchHistoryMutation({
          variables: {
            input: buildInput(item, currentTimeSec, totalDurationSec),
          },
        });
      } catch (err: any) {
        // Non-critical — swallow silently
        console.warn('[useWatchHistory] Save failed:', err?.message);
      }
    },
    [activePlaylistId, buildInput, saveWatchHistoryMutation]
  );

  // ── Start 2-minute progress tracking (VOD & SERIES only) ────
  const startProgressTracking = useCallback(
    (item: WatchableItem, playerRef: React.MutableRefObject<VideoPlayerRef | null>) => {
      if (item.type === 'LIVE') return; // Never track live position
      if (intervalRef.current) return;  // Already running

      intervalRef.current = setInterval(async () => {
        const currentTime = playerRef.current?.currentTime;
        const totalDuration = playerRef.current?.duration;
        if (currentTime == null || currentTime <= 0) return;

        await saveHistory(item, currentTime, totalDuration);
      }, PROGRESS_INTERVAL_MS);
    },
    [saveHistory]
  );

  // ── Stop tracking (call in useEffect cleanup) ────────────────
  const stopProgressTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Clear history ────────────────────────────────────────────
  const [clearWatchHistoryMutation] = useMutation<ClearWatchHistoryResponse>(CLEAR_WATCH_HISTORY);

  const clearHistory = useCallback(
    async (type?: 'LIVE' | 'MOVIE' | 'SERIES') => {
      if (!activePlaylistId) return;
      try {
        const variables: any = { playlistId: activePlaylistId };
        if (type) {
          variables.type = type;
        }

        await clearWatchHistoryMutation({
          variables,
          refetchQueries: [{
            query: GET_WATCH_HISTORY,
            variables: {
              filters: {
                playlistId: activePlaylistId,
                // Refetch the current view
                type: type || undefined
              }
            }
          }],
        });
      } catch (err: any) {
        console.warn('[useWatchHistory] Clear failed:', err?.message);
      }
    },
    [activePlaylistId, clearWatchHistoryMutation]
  );

  // ── Fetch history (inner hook — call inside a component) ─────
  const useGetWatchHistory = (filters: Partial<QueryWatchHistoryInput> = {}) => {
    return useQuery<GetWatchHistoryResponse>(GET_WATCH_HISTORY, {
      variables: {
        filters: {
          playlistId: activePlaylistId ?? '',
          page: 1,
          limit: 50,
          ...filters,
        },
      },
      skip: !activePlaylistId,
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  };

  return {
    saveHistory,
    startProgressTracking,
    stopProgressTracking,
    useGetWatchHistory,
    clearHistory,
  };
}
