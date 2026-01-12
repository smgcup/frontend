import { MatchByIdQuery, PlayerPosition } from '@/graphql';
import type { Match } from '../contracts';

type PlayerLike = {
  id: string;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
};

const mapPlayer = (p: PlayerLike) => ({
  id: p.id,
  firstName: p.firstName,
  lastName: p.lastName,
  ...(p.position == null ? {} : { position: p.position }),
});

export const mapMatchById = (row: MatchByIdQuery['matchById']): Match | null => {
  if (!row) return null;
  return {
    id: row.id,
    firstOpponent: {
      id: row.firstOpponent.id,
      name: row.firstOpponent.name,
      players: (row.firstOpponent.players ?? []).map(mapPlayer),
    },
    secondOpponent: {
      id: row.secondOpponent.id,
      name: row.secondOpponent.name,
      players: (row.secondOpponent.players ?? []).map(mapPlayer),
    },
    date: String(row.date),
    status: row.status,
    ...(row.score1 == null ? {} : { score1: row.score1 }),
    ...(row.score2 == null ? {} : { score2: row.score2 }),
  };
};
