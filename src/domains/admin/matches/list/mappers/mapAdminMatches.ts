import { type Match, type MatchTeam } from '@/domains/matches/contracts';
import { type MatchListItem } from '@/domains/matches/contracts';
import { type MatchesQuery } from '@/graphql';
import { mapMatchListItem } from '@/domains/matches/mappers/mapMatchListItem';

const mapAdminMatch = (m: MatchListItem): Match => {
  const mapOpponentToTeam = (opponent: { id: string; name: string }): MatchTeam => {
    return {
      id: opponent.id,
      name: opponent.name,
      players: [], // Players are not fetched in the Matches query, so we use an empty array
    };
  };

  return {
    id: m.id,
    date: String(m.date),
    status: m.status,
    // Only include score1 if it's not null/undefined
    ...(m.score1 == null ? {} : { score1: m.score1 }),
    // Only include score2 if it's not null/undefined
    ...(m.score2 == null ? {} : { score2: m.score2 }),
    firstOpponent: mapOpponentToTeam(m.firstOpponent),
    secondOpponent: mapOpponentToTeam(m.secondOpponent),
  };
};

/**
 * Maps the MatchesQuery result to an array of Match objects for the admin list view.
 * This function handles the full transformation chain:
 * GraphQL result → MatchListItem → Match
 *
 * @param queryData - The data from the Matches GraphQL query
 * @returns Array of Match objects, or empty array if no matches
 */
export const mapAdminMatches = (queryData: MatchesQuery | undefined): Match[] => {
  const matchesData = queryData?.matches;
  if (!matchesData) return [];
  // Chain the mappers: GraphQL result → MatchListItem → Match
  return matchesData.map((match) => mapAdminMatch(mapMatchListItem(match)));
};
