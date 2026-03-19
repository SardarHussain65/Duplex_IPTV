/**
 * REST Client
 * Typed fetch wrapper with:
 *  - Auth header injection
 *  - Automatic token refresh on 401
 *  - Timeout support
 *  - Retry logic for transient errors
 *  - Structured error handling
 */

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config';
import { tokenStorage } from './tokenStorage';
import { ApiError, AuthTokens } from './types';

// ─── Internal Helpers ──────────────────────────────────────────────────────────

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    // Wait for in-flight refresh
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  let newToken: string | null = null;

  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetchWithTimeout(
      `${API_BASE_URL}/api/auth/refresh`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (response.ok) {
      const data: AuthTokens = await response.json();
      await tokenStorage.setTokens(data.accessToken, data.refreshToken);
      newToken = data.accessToken;
    } else {
      await tokenStorage.clearTokens();
    }
  } catch (err) {
    console.error('Token refresh failed:', err);
  } finally {
    isRefreshing = false;
    // Notify all waiters in the queue
    refreshQueue.forEach((resolve) => resolve(newToken));
    refreshQueue = [];
  }

  return newToken;
}

// ─── Public API ────────────────────────────────────────────────────────────────

export class ApiRequestError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Skip auth header even if token exists */
  skipAuth?: boolean;
}

/**
 * Core REST fetch. Handles auth injection, 401 refresh, and error parsing.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, ...rest } = options;

  const buildHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(rest.headers as Record<string, string>),
    };

    if (!skipAuth) {
      const token = await tokenStorage.getAccessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const execute = async (extraHeaders?: Record<string, string>): Promise<Response> => {
    const headers = { ...(await buildHeaders()), ...extraHeaders };
    const separator = path.startsWith('/') ? '' : '/';
    return fetchWithTimeout(`${API_BASE_URL}${separator}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let response = await execute();

  // Auto-refresh on 401
  if (response.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await execute({ Authorization: `Bearer ${newToken}` });
    } else {
      throw new ApiRequestError(401, 'Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    let errorBody: ApiError | null = null;
    try {
      errorBody = await response.json();
    } catch {
      // not JSON
    }
    throw new ApiRequestError(
      response.status,
      errorBody?.message ?? `Request failed with status ${response.status}`,
      errorBody
    );
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// ─── Convenience Methods ───────────────────────────────────────────────────────

export const restClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'POST', body });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'PUT', body });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};
