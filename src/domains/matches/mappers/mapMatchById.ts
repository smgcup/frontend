import type { Match, MatchStatus } from '../contracts';

type PlayerLike = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  position?: string | null;
};

type TeamLike = {
  id: string;
  name?: string | null;
  players?: PlayerLike[] | null;
};

type MatchByIdLike = {
  id: string;
  firstOpponent: TeamLike;
  secondOpponent: TeamLike;
  date: unknown;
  status: MatchStatus | string;
  score1?: number | null;
  score2?: number | null;
};

const mapPlayer = (p: PlayerLike) => ({
  id: p.id,
  firstName: p.firstName ?? '',
  lastName: p.lastName ?? '',
  ...(p.position == null ? {} : { position: p.position }),
});

export const mapMatchById = (row: MatchByIdLike): Match => {
  return {
    id: row.id,
    firstOpponent: {
      id: row.firstOpponent.id,
      name: row.firstOpponent.name ?? '',
      players: (row.firstOpponent.players ?? []).map(mapPlayer),
    },
    secondOpponent: {
      id: row.secondOpponent.id,
      name: row.secondOpponent.name ?? '',
      players: (row.secondOpponent.players ?? []).map(mapPlayer),
    },
    date: String(row.date),
    status: row.status as MatchStatus,
    ...(row.score1 == null ? {} : { score1: row.score1 }),
    ...(row.score2 == null ? {} : { score2: row.score2 }),
  };
};
