/**
 * Token Storage
 * Persists auth tokens using a simple, cross-platform key-value store.
 * Uses expo-secure-store when available, falls back to AsyncStorage.
 *
 * NOTE: All methods are async so callers don't need to change if we 
 * swap the underlying storage implementation.
 */

import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'duplex_access_token';
const REFRESH_TOKEN_KEY = 'duplex_refresh_token';

export const tokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken),
    ]);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  },
};
