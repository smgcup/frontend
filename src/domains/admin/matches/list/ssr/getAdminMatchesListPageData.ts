import { getClient } from '@/lib/initializeApollo';
import { GetMatchesDocument, type GetMatchesQuery, type GetMatchesQueryVariables } from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
export const getAdminMatchesListPageData = async () => {
  const client = await getClient();

  const { data, error } = await client.query<GetMatchesQuery, GetMatchesQueryVariables>({
    query: GetMatchesDocument,
  });

  const matches = data?.matches.map(mapMatch) ?? [];

  // Ensure this is safe to pass into client components (must be serializable).
  const errorMessage = error
    ? typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: unknown }).message ?? 'Failed to load matches.')
      : 'Failed to load matches.'
    : null;

  return { matches, errorMessage };
};
