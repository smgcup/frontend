import { getClient } from '@/lib/initializeApollo';
import { GetMatchesDocument, type GetMatchesQuery, type GetMatchesQueryVariables } from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';

export const getPredictorPageData = async () => {
  const client = await getClient();

  try {
    const { data, error } = await client.query<GetMatchesQuery, GetMatchesQueryVariables>({
      query: GetMatchesDocument,
    });

    const matches = data?.matches.map(mapMatch) ?? [];
    const errorMessage = error?.message ?? null;

    return { matches, error: errorMessage };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return { matches: [], error: errorMessage };
  }
};
