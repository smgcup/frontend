import type { Match } from '../contracts';
import { type GetMatchesQuery } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';

export const mapMatch = (m: GetMatchesQuery['matches'][number]): Match => {
  return {
    id: m.id,
    date: String(m.date),
    status: m.status,
    ...(m.score1 == null ? {} : { score1: m.score1 }),
    ...(m.score2 == null ? {} : { score2: m.score2 }),
    firstOpponent: mapTeam(m.firstOpponent),
    secondOpponent: mapTeam(m.secondOpponent),
  };
};
