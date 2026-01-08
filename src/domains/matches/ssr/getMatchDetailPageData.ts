import { getClient } from '@/lib/initializeApollo';
import {
  MatchByIdDocument,
  type MatchByIdQuery,
  type MatchByIdQueryVariables,
  MatchEventsDocument,
  type MatchEventsQuery,
  type MatchEventsQueryVariables,
} from '@/graphql';
import type { Match, MatchEvent } from '@/domains/matches/contracts';
import { mapMatchById } from '@/domains/matches/mappers/mapMatchById';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';

export const getMatchDetailPageData = async (matchId: string) => {
  const client = await getClient();

  const { data: matchData, error: matchError } = await client.query<MatchByIdQuery, MatchByIdQueryVariables>({
    query: MatchByIdDocument,
    variables: { id: matchId },
  });

  const matchRow = matchData?.matchById ?? null;
  const match: Match | null = matchRow ? mapMatchById(matchRow) : null;

  if (!match) {
    return { match: null as Match | null, events: [] as MatchEvent[], error: matchError };
  }

  const { data: eventsData, error: eventsError } = await client.query<MatchEventsQuery, MatchEventsQueryVariables>({
    query: MatchEventsDocument,
    variables: { matchId },
  });

  const events: MatchEvent[] = (eventsData?.matchEvents ?? []).map(mapMatchEvent);

  return { match, events, error: matchError ?? eventsError };
};


