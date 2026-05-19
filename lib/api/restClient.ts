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
import { ApiError } from './types';

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
  /** Custom timeout for this request */
  timeout?: number;
}

/**
 * Core REST fetch. Simplified - no auth injection or 401 refresh.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeout, ...rest } = options;

  const execute = async (): Promise<Response> => {
    const headers = { 
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(rest.headers as Record<string, string>)
    };
    const separator = path.startsWith('/') ? '' : '/';
    return fetchWithTimeout(`${API_BASE_URL}${separator}${path}`, {
      ...rest,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }, timeout);
  };

  const response = await execute();

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

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  // Fallback to text for raw URLs or other non-JSON formats
  return response.text() as unknown as Promise<T>;
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
