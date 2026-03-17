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

// ─── Error Link ────────────────────────────────────────────────────────────────

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.warn(
        `[GraphQL] ${operation.operationName} — ${message}`,
        { locations, path, code: extensions?.code }
      );
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
