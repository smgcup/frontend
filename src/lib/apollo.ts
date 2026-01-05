import { HttpLink, split } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { createAuthLink, AUTH_COOKIE_NAME } from './auth';
import { getCookie } from './cookies';
import { getBrowserGraphqlEndpoint } from '@/lib/graphqlEndpoint';

export const makeClient = (): ApolloClient => {
  // Browser-safe endpoint. If env is "/graphql", keep it relative.
  const endpoint = getBrowserGraphqlEndpoint();

  const httpLink = new HttpLink({
    uri: endpoint,
    fetchOptions: { cache: 'no-store' },
    // credentials: "include",
    headers: process.env.NEXT_PUBLIC_GRAPHQL_TOKEN
      ? {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHQL_TOKEN}`,
        }
      : undefined,
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

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
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
};
