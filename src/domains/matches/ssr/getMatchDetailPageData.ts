import { getClient } from '@/lib/initializeApollo';
import {
  MatchByIdDocument,
  type MatchByIdQuery,
  type MatchByIdQueryVariables,
  MatchEventsDocument,
  type MatchEventsQuery,
  type MatchEventsQueryVariables,
} from '@/graphql';
import type { MatchEvent } from '@/domains/matches/contracts';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';

export const getMatchDetailPageData = async (matchId: string) => {
  const client = await getClient();

  const { data: matchData, error: matchError } = await client.query<MatchByIdQuery, MatchByIdQueryVariables>({
    query: MatchByIdDocument,
    variables: { id: matchId },
  });

  const match = matchData?.matchById ? mapMatch(matchData.matchById) : null;

  if (!match) {
    return { match: null, events: [], error: matchError };
  }

  const { data: eventsData, error: eventsError } = await client.query<MatchEventsQuery, MatchEventsQueryVariables>({
    query: MatchEventsDocument,
    variables: { matchId },
  });

  const events: MatchEvent[] = (eventsData?.matchEvents ?? []).map(mapMatchEvent);

  return { match, events, error: matchError ?? eventsError };
};
