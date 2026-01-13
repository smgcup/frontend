import type { Match } from '../contracts';
import { type MatchesQuery } from '@/graphql';

export const mapMatch = (m: MatchesQuery['matches'][number]): Match => {
  return {
    id: m.id,
    date: String(m.date),
    status: m.status,
    ...(m.score1 == null ? {} : { score1: m.score1 }),
    ...(m.score2 == null ? {} : { score2: m.score2 }),
    firstOpponent: {
      id: m.firstOpponent.id,
      name: m.firstOpponent.name,
      players: [],
    },
    secondOpponent: {
      id: m.secondOpponent.id,
      name: m.secondOpponent.name,
      players: [],
    },
  };
};
