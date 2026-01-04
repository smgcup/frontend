import { registerApolloClient } from '@apollo/client-integration-nextjs';
import { HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';
import { cookies } from 'next/headers';

export const { getClient } = registerApolloClient(async () => {
  // Get auth token from cookies
  const cookieStore = await cookies();
  const authToken = cookieStore.get(`sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`)?.value;

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
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
