import { headers } from 'next/headers';

/**
 * Returns an absolute GraphQL URL suitable for Node.js fetch (SSR/RSC).
 * Supports env values like:
 * - "https://api.example.com/graphql" (already absolute)
 * - "/graphql" (relative to the current host)
 */
export async function getServerGraphqlEndpoint() {
  const raw = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql';
  if (!raw.startsWith('/')) return raw;

  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';

  if (!host) {
    // Fallback that at least won't throw; user should configure NEXT_PUBLIC_GRAPHQL_ENDPOINT properly.
    return `http://localhost:4000${raw}`;
  }

  return `${proto}://${host}${raw}`;
}


