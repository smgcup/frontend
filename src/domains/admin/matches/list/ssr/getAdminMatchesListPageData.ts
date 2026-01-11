import { getClient } from '@/lib/initializeApollo';
import { MatchesDocument, type MatchesQuery, type MatchesQueryVariables } from '@/graphql';
import { mapAdminMatches } from '../mappers/mapAdminMatches';
import type { Match } from '@/domains/matches/contracts';

export const getAdminMatchesListPageData = async () => {
  const client = await getClient();

  const { data, error } = await client.query<MatchesQuery, MatchesQueryVariables>({
    query: MatchesDocument,
  });

  const matches: Match[] = mapAdminMatches(data);

  // Ensure this is safe to pass into client components (must be serializable).
  const errorMessage = error
    ? typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: unknown }).message ?? 'Failed to load matches.')
      : 'Failed to load matches.'
    : null;

  return { matches, errorMessage };
};
