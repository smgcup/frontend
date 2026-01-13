import { getClient } from '@/lib/initializeApollo';
import { MatchesDocument, type MatchesQuery, type MatchesQueryVariables } from '@/graphql';
import { mapMatch } from '../mappers/mapMatch';
export const getMatchesPageData = async () => {
  const client = await getClient();

  const { data, error: matchesError } = await client.query<MatchesQuery, MatchesQueryVariables>({
    query: MatchesDocument,
  });

  const matches = data?.matches.map(mapMatch) ?? [];
  return { matches, error: matchesError };
};
