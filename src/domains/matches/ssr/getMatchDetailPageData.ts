import { getPublicClient } from '@/lib/initializeApollo';
import { MatchByIdDocument, MatchEventsDocument } from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';

export const getMatchDetailPageData = async (matchId: string) => {
  try {
    const client = getPublicClient();
    const { data } = await client.query({
      query: MatchByIdDocument,
      variables: { id: matchId },
    });

    if (!data?.matchById) {
      return { match: null, events: [], error: null };
    }

    const match = mapMatch(data.matchById);

    const { data: eventsData } = await client.query({
      query: MatchEventsDocument,
      variables: { matchId },
    });

    const events = eventsData?.matchEvents.map(mapMatchEvent) ?? [];

    return { match, events, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load match details';
    return { match: null, events: [], error: errorMessage };
  }
};
