import { MatchByIdQuery } from '@/graphql';
import type { Match } from '../contracts';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';

export const mapMatchById = (row: MatchByIdQuery['matchById']): Match | null => {
  if (!row) return null;
  return {
    id: row.id,
    firstOpponent: {
      id: row.firstOpponent.id,
      name: row.firstOpponent.name,
      players: row.firstOpponent.players?.map(mapPlayer),
    },
    secondOpponent: {
      id: row.secondOpponent.id,
      name: row.secondOpponent.name,
      players: row.secondOpponent.players?.map(mapPlayer),
    },
    date: String(row.date),
    status: row.status,
    ...(row.score1 == null ? {} : { score1: row.score1 }),
    ...(row.score2 == null ? {} : { score2: row.score2 }),
  };
};
