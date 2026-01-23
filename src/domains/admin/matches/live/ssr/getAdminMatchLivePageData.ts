import { getClient } from '@/lib/initializeApollo';
import {
  MatchByIdDocument,
  type MatchByIdQuery,
  type MatchByIdQueryVariables,
  MatchEventsDocument,
  type MatchEventsQuery,
  type MatchEventsQueryVariables,
} from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';
import type { MatchEvent } from '@/domains/matches/contracts';

export const getAdminMatchLivePageData = async (matchId: string) => {
  const client = await getClient();

  const { data: matchData, error: matchError } = await client.query<MatchByIdQuery, MatchByIdQueryVariables>({
    query: MatchByIdDocument,
    variables: { id: matchId },
  });

  const { data: eventsData, error: eventsError } = await client.query<MatchEventsQuery, MatchEventsQueryVariables>({
    query: MatchEventsDocument,
    variables: { matchId },
  });

  if (!matchData || !matchData.matchById) {
    return { match: null, events: [], matchErrorMessage: 'Match not found', eventsErrorMessage: 'Events not found' };
  }

  const matchRow = matchData.matchById;
  const mappedMatch = mapMatch(matchRow);

  const match = {
    ...mappedMatch,
    score1: mappedMatch?.score1 ?? 0,
    score2: mappedMatch?.score2 ?? 0,
  };

  const eventsRows = eventsData?.matchEvents ?? [];
  // Sort ascending by minute, then createdAt (stable-ish)
  const sorted = [...eventsRows].sort((a, b) => {
    if (a.minute !== b.minute) return a.minute - b.minute;
    return String(a.createdAt).localeCompare(String(b.createdAt));
  });
  const events: MatchEvent[] = sorted.map(mapMatchEvent);

  const matchErrorMessage = matchError
    ? typeof matchError === 'object' && matchError && 'message' in matchError
      ? String((matchError as { message?: unknown }).message ?? 'Failed to load match.')
      : 'Failed to load match.'
    : null;

  const eventsErrorMessage = eventsError
    ? typeof eventsError === 'object' && eventsError && 'message' in eventsError
      ? String((eventsError as { message?: unknown }).message ?? 'Failed to load events.')
      : 'Failed to load events.'
    : null;

  return { match, events, matchErrorMessage, eventsErrorMessage };
};
