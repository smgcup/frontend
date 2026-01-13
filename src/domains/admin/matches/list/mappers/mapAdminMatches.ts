import { type Match, type MatchTeam } from '@/domains/matches/contracts';
import { type MatchesQuery } from '@/graphql';

export const mapAdminMatch = (m: MatchesQuery['matches'][number]): Match => {
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
