import { getMatchByIdData, getMatchEventsData } from '@/lib/cachedQueries';
import type { MatchEvent } from '@/domains/matches/contracts';

export const getMatchDetailPageData = async (matchId: string) => {
  try {
    const match = await getMatchByIdData(matchId);

    if (!match) {
      return { match: null, events: [], error: null };
    }

    const events: MatchEvent[] = await getMatchEventsData(matchId);

    return { match, events, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load match details';
    return { match: null, events: [], error: errorMessage };
  }
};
