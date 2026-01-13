import { type Match } from '@/domains/matches/contracts';
import { type GetMatchesQuery } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
export const mapAdminMatch = (m: GetMatchesQuery['matches'][number]): Match => {
  return {
    id: m.id,
    date: String(m.date),
    status: m.status,
    // Only include score1 if it's not null/undefined
    ...(m.score1 == null ? {} : { score1: m.score1 }),
    // Only include score2 if it's not null/undefined
    ...(m.score2 == null ? {} : { score2: m.score2 }),
    firstOpponent: mapTeam(m.firstOpponent),
    secondOpponent: mapTeam(m.secondOpponent),
  };
};
