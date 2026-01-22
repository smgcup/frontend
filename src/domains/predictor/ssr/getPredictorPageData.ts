import { getClient } from '@/lib/initializeApollo';
import { GetMatchesDocument, type GetMatchesQuery, type GetMatchesQueryVariables } from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';

export const getPredictorPageData = async () => {
  const client = await getClient();

  const { data, error: matchesError } = await client.query<GetMatchesQuery, GetMatchesQueryVariables>({
    query: GetMatchesDocument,
  });

  const matches = data?.matches.map(mapMatch) ?? [];
  return { matches, error: matchesError };
};
