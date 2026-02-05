import { getPublicClient } from '@/lib/initializeApollo';
import { GetMatchesDocument } from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';

export const getMatchesPageData = async () => {
  try {
    const client = getPublicClient();
    const { data } = await client.query({ query: GetMatchesDocument });
    const matches = data?.matches.map(mapMatch) ?? [];
    return { matches, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load matches';
    return { matches: [], error: errorMessage };
  }
};
