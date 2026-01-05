import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/client-integration-nextjs';
import { headers } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { getServerGraphqlEndpoint } from '@/lib/graphqlEndpoint.server';

function getCookieValue(cookieHeader: string, name: string): string | null {
  // Simple cookie parser (works for typical cookie strings)
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export const { getClient } = registerApolloClient(async () => {
  const h = await headers();
  const cookieHeader = h.get('cookie') ?? '';

  const tokenFromCookie = getCookieValue(cookieHeader, AUTH_COOKIE_NAME);

  // Same idea as your client:
  // - if auth cookie exists -> use it
  // - else fallback to NEXT_PUBLIC_GRAPHQL_TOKEN (or any server-only token you use)
  const token = tokenFromCookie ?? process.env.NEXT_PUBLIC_GRAPHQL_TOKEN ?? null;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
  const uri = await getServerGraphqlEndpoint();

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri,
      fetch,
      headers: {
        // forward cookies for session-based auth if your API uses them
        cookie: cookieHeader,
        // add bearer auth like your browser client
        ...(authHeader as Record<string, string>),
      },
    }),
  });
});
