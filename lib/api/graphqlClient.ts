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
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // Check for 401 Unauthorized or Unauthenticated
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.message?.includes('Unauthorized')) {
        // Handle refresh logic below
        break;
      }
      console.warn(
        `[GraphQL] ${operation.operationName} — ${err.message}`,
        { locations: err.locations, path: err.path, code: err.extensions?.code }
      );
    }
  }

  const isUnauthorized = 
    graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED' || e.message?.includes('Unauthorized')) ||
    (networkError as any)?.statusCode === 401;

  if (isUnauthorized) {
    return fromPromise(
      (async () => {
        try {
          const refreshToken = await tokenStorage.getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token available');

          // Use native fetch to bypass Apollo Link logic for the refresh call
          const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: `
                mutation RefreshTokenMobile($refreshToken: String!) {
                  refreshTokenMobile(refreshToken: $refreshToken) {
                    accessToken
                    refreshToken
                  }
                }
              `,
              variables: { refreshToken },
            }),
          });

          const json = await response.json();
          const { accessToken, refreshToken: newRefreshToken } = json.data?.refreshTokenMobile || {};

          if (accessToken && newRefreshToken) {
            await tokenStorage.setTokens(accessToken, newRefreshToken);
            
            // Re-inject the new token into the headers for the upcoming retry
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
              },
            }));
            return true;
          }
          throw new Error('Refresh response invalid');
        } catch (e) {
          console.error('[GraphQL] Session refresh failed:', e);
          await tokenStorage.clearTokens();
          return false;
        }
      })()
    ).flatMap((success) => {
      if (success) return forward(operation);
      return new Observable((observer) => observer.complete()); // Properly stop execution
    });
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
