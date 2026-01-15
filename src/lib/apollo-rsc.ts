import { registerApolloClient } from '@apollo/client-integration-nextjs';
import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

export const { getClient } = registerApolloClient(async () => {
  const h = await headers();
  // Get auth token from cookies
  const cookieStore = await cookies();
  const authToken = cookieStore.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`)?.value;

  const rawEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
  const endpoint =
    rawEndpoint.startsWith('/') && rawEndpoint.length > 1
      ? (() => {
          const proto = h.get('x-forwarded-proto') ?? 'http';
          const host = h.get('x-forwarded-host') ?? h.get('host');
          if (host) return `${proto}://${host}${rawEndpoint}`;
          return `http://localhost:${process.env.PORT ?? 3000}${rawEndpoint}`;
        })()
      : rawEndpoint;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: endpoint,
      fetchOptions: { cache: 'no-store' },
      headers: {
        ...(process.env.GRAPHQL_SERVER_TOKEN && {
          Authorization: `Bearer ${process.env.GRAPHQL_SERVER_TOKEN}`,
        }),
        ...(authToken && {
          authorization: `Bearer ${authToken}`,
        }),
      },
    }),
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
});
