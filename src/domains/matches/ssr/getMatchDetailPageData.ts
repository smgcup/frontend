import { getPublicClient } from '@/lib/initializeApollo';
import {
  MatchByIdDocument,
  MatchByIdQuery,
  MatchByIdQueryVariables,
  MatchEventsDocument,
  MatchEventsQuery,
  MatchEventsQueryVariables,
} from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';
import type { MatchEvent } from '@/domains/matches/contracts';

export const getMatchDetailPageData = async (matchId: string) => {
  try {
    const client = getPublicClient();

    const { data: matchData } = await client.query<MatchByIdQuery, MatchByIdQueryVariables>({
      query: MatchByIdDocument,
      variables: { id: matchId },
    });

    const match = matchData?.matchById ? mapMatch(matchData.matchById) : null;

    if (!match) {
      return { match: null, events: [], error: null };
    }

    const { data: eventsData } = await client.query<MatchEventsQuery, MatchEventsQueryVariables>({
      query: MatchEventsDocument,
      variables: { matchId },
    });

    const events: MatchEvent[] = eventsData?.matchEvents.map(mapMatchEvent) ?? [];

    return { match, events, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load match details';
    return { match: null, events: [], error: errorMessage };
  }
};
