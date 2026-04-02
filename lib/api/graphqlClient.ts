/**
 * Apollo GraphQL Client (Apollo Client v3)
 * - setContext auth link: injects Bearer token per request
 * - Error link: centralised error logging
 * - Retry link: retries transient network errors (not 401/403)
 * - InMemoryCache: configured for standard GraphQL usage
 */

import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  InMemoryCache,
  fromPromise,
  from,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { GRAPHQL_URL } from './config';
import { tokenStorage } from './tokenStorage';
import { REFRESH_TOKEN_MOBILE } from './mutations';
import { print } from 'graphql';

// ─── Refresh Logic Singleton ──────────────────────────────────────────────────

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

/**
 * Handles the logic of refreshing the access token once for multiple concurrent fails.
 * Returns a promise that resolves with the new access token, or null if refresh failed.
 */
async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push(resolve);
    });
  }

  isRefreshing = true;
  let newToken: string | null = null;

  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      console.error('[GraphQL] Session refresh failed: No refresh token in storage.');
      return null;
    }

    // Use native fetch to bypass Apollo Link logic for the refresh mutation itself
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: print(REFRESH_TOKEN_MOBILE),
        variables: { refreshToken },
      }),
    });

    const json = await response.json();
    const result = json.data?.refreshTokenMobile;

    if (result?.accessToken && result?.refreshToken) {
      await tokenStorage.setTokens(result.accessToken, result.refreshToken);
      newToken = result.accessToken;
    } else {
      console.warn('[GraphQL] Session refresh failed: Invalid response from server.', json);
      await tokenStorage.clearTokens();
    }
  } catch (error) {
    console.error('[GraphQL] Session refresh exception:', error);
    // Be careful here — only clear if definitively toast
  } finally {
    isRefreshing = false;
    refreshQueue.forEach((resolve) => resolve(newToken));
    refreshQueue = [];
  }

  return newToken;
}

// ─── Auth Link ─────────────────────────────────────────────────────────────────

const authLink = setContext(async (_, { headers }) => {
  const token = await tokenStorage.getAccessToken();
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

// ─── Error Link (with Refresh Logic) ──────────────────────────────────────────

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const isUnauthorized = 
    graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED' || e.message?.toLowerCase().includes('unauthorized')) ||
    (networkError as any)?.statusCode === 401;

  if (isUnauthorized) {
    return fromPromise(refreshAccessToken()).flatMap((accessToken) => {
      if (accessToken) {
        // Re-inject the new token into the headers for the upcoming retry
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
          },
        }));
        return forward(operation);
      }

      // If refresh failed, stop execution
      return new Observable((observer) => {
        observer.error(new Error('Session expired'));
        observer.complete();
      });
    });
  }

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      console.warn(
        `[GraphQL] ${operation.operationName} — ${err.message}`,
        { locations: err.locations, path: err.path, code: err.extensions?.code }
      );
    }
  }

  if (networkError) {
    console.error(`[GraphQL] Network error on ${operation.operationName}:`, networkError);
  }
});

// ─── Retry Link ────────────────────────────────────────────────────────────────

const retryLink = new RetryLink({
  delay: { initial: 300, max: 2000, jitter: true },
  attempts: {
    max: 3,
    // Only retry on network-layer errors, never on auth failures
    retryIf: (error: any) =>
      !!error && error.statusCode !== 401 && error.statusCode !== 403,
  },
});

// ─── HTTP Link ─────────────────────────────────────────────────────────────────

const httpLink = createHttpLink({ uri: GRAPHQL_URL });

// ─── Cache ─────────────────────────────────────────────────────────────────────

const cache = new InMemoryCache();

// ─── Client Export ─────────────────────────────────────────────────────────────

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([errorLink, retryLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
