import { HttpLink, split } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { createAuthLink, AUTH_COOKIE_NAME } from './auth';
import { getCookie } from './cookies';

export const makeClient = (): ApolloClient => {
  // In the browser we want a single ApolloClient instance so the InMemoryCache
  // survives route navigation (and provider re-renders).
  if (typeof window !== 'undefined' && browserApolloClient) {
    return browserApolloClient;
  }

  // Get the GraphQL endpoint, using current hostname if it's localhost
  const getGraphQLEndpoint = () => {
    if (typeof window !== 'undefined') {
      const currentHost = window.location.hostname;
      const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
      // If endpoint uses localhost but we're accessing via IP, replace it
      if (endpoint.includes('localhost') && currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
        return endpoint.replace('localhost', currentHost);
      }
      return endpoint;
    }
    const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
    // If someone configured a relative endpoint (e.g. "/graphql"), Node fetch needs an absolute URL
    if (endpoint.startsWith('/') && endpoint.length > 1) {
      return `http://localhost:${process.env.PORT ?? 3000}${endpoint}`;
    }
    return endpoint;
  };

  const httpLink = new HttpLink({
    uri: getGraphQLEndpoint(),
    fetchOptions: { cache: 'no-store' },
    // credentials: "include",
  });

  const authLink = createAuthLink();

  // WebSocket link for subscriptions
  const getWsUrl = () => {
    if (process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT) {
      return process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT;
    }
    if (process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT) {
      // Convert http/https to ws/wss
      return process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:');
    }
    return 'ws://localhost:4000/graphql';
  };

  const wsUrl = getWsUrl();

  if (typeof window !== 'undefined') {
    console.log('[WebSocket] Connecting to:', wsUrl);
  }

  const wsLink =
    typeof window !== 'undefined'
      ? new GraphQLWsLink(
          createClient({
            url: wsUrl,
            connectionParams: () => {
              const token = getCookie(AUTH_COOKIE_NAME);
              const params: Record<string, string> = {};

              if (token) {
                params.authorization = `Bearer ${token}`;
              }

              if (process.env.NEXT_PUBLIC_GRAPHQL_TOKEN) {
                params.Authorization = `Bearer ${process.env.NEXT_PUBLIC_GRAPHQL_TOKEN}`;
              }

              console.log('[WebSocket] Connection params:', {
                hasToken: !!token,
                hasGraphQLToken: !!process.env.NEXT_PUBLIC_GRAPHQL_TOKEN,
              });

              return params;
            },
            shouldRetry: () => true,
            retryAttempts: 5,
            retryWait: async (retries) => {
              // Exponential backoff: 0s, 1s, 2s, 4s, 8s
              const waitTime = Math.min(1000 * Math.pow(2, retries), 8000);
              console.log(`[WebSocket] Retrying in ${waitTime}ms (attempt ${retries + 1})`);
              await new Promise((resolve) => setTimeout(resolve, waitTime));
            },
            on: {
              opened: () => {
                console.log('[WebSocket] ✅ Connection opened successfully');
              },
              closed: (event) => {
                console.warn('[WebSocket] ❌ Connection closed', {
                  code: (event as CloseEvent).code,
                  reason: (event as CloseEvent).reason,
                  wasClean: (event as CloseEvent).wasClean,
                });
              },
              error: (error) => {
                console.error('[WebSocket] ❌ Error:', error);
              },
              connecting: () => {
                console.log('[WebSocket] 🔄 Connecting...');
              },
            },
          }),
        )
      : httpLink; // Fallback to httpLink on server-side

  // Split link: use WebSocket for subscriptions, HTTP for queries and mutations
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
  );

  const client = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            /**
             * Paginated player leaderboard.
             *
             * We want cache entries to be keyed by (sortBy, limit) NOT by page,
             * and we want subsequent pages to merge into a single growing list.
             */
            playersLeaderboard: {
              keyArgs: ['sortBy', 'limit'],
              merge(existing, incoming, { args }) {
                const existingPlayers = existing?.players ?? [];
                const incomingPlayers = incoming?.players ?? [];

                // Default to page 1 when args are missing.
                const page = typeof args?.page === 'number' ? args.page : 1;
                const limit =
                  typeof args?.limit === 'number'
                    ? args.limit
                    : incomingPlayers.length > 0
                      ? incomingPlayers.length
                      : 20;

                const start = Math.max(0, (page - 1) * limit);
                const mergedPlayers = existingPlayers.slice(0);

                for (let i = 0; i < incomingPlayers.length; i += 1) {
                  mergedPlayers[start + i] = incomingPlayers[i];
                }

                return {
                  ...incoming,
                  // Preserve any already-loaded pages beyond the incoming range.
                  players: mergedPlayers,
                };
              },
            },
          },
        },
      },
    }),
    link: splitLink,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  if (typeof window !== 'undefined') {
    browserApolloClient = client;
  }

  return client;
};

let browserApolloClient: ApolloClient | null = null;
