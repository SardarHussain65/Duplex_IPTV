/**
 * AuthContext
 * Global auth state shell.
 *
 * Wraps the whole app via AuthProvider.
 * Consume via the `useAuthContext` hook anywhere in the tree.
 */

import { tokenStorage } from '@/lib/api/tokenStorage';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type DeviceStatus = 'unknown' | 'trial' | 'active' | 'warning' | 'expired' | 'blocked';

interface AuthState {
  /** Whether the initial auth check is still running */
  isLoading: boolean;
  /** Activation / subscription status of this device */
  deviceStatus: DeviceStatus;
  /** Currently stored access token */
  accessToken: string | null;
}

interface AuthContextValue extends AuthState {
  /** Clear tokens and reset auth state */
  logout: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    deviceStatus: 'unknown',
    accessToken: null,
  });

  // Load stored token and verify connectivity once on mount
  useEffect(() => {
    // 1. Initial token load
    tokenStorage.getAccessToken().then((token) => {
      setState((prev) => ({
        ...prev,
        accessToken: token,
        isLoading: false
      }));
    });

    // 2. Simple Heartbeat Check (Console only)
    const runHeartbeat = async () => {
      try {
        const res = await fetch('https://duplex-iptv-backend.replatechnologies.com/health');
        if (res.ok) {
          console.log('✅ [API] Connectivity Verified: Backend is reachable.');
        } else {
          console.log('⚠️ [API] Connectivity Warning: Backend returned status', res.status);
        }
      } catch (err: any) {
        console.log('❌ [API] Connectivity Failed:', err.message);
      }
    };
    runHeartbeat();
  }, []);

  const logout = React.useCallback(async () => {
    await tokenStorage.clearTokens();
    setState((prev) => ({
      ...prev,
      accessToken: null,
      deviceStatus: 'unknown',
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}
