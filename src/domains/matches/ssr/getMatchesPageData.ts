import { getClient } from '@/lib/initializeApollo';
import { MatchesDocument, type MatchesQuery, type MatchesQueryVariables } from '@/graphql';
import type { MatchListItem } from '../contracts';
import { mapMatchListItem } from '../mappers/mapMatchListItem';

export const getMatchesPageData = async () => {
  const client = await getClient();

  const { data, error: matchesError } = await client.query<MatchesQuery, MatchesQueryVariables>({
    query: MatchesDocument,
  });

  const matches: MatchListItem[] = data?.matches.map(mapMatchListItem) ?? [];

  return { matches, error: matchesError };
};
