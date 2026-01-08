import type { MatchListItem, MatchStatus } from '../contracts';

type MatchOpponentLike = {
  id: string;
  name?: string | null;
};

type MatchListItemLike = {
  id: string;
  date: unknown;
  status: MatchStatus;
  score1?: number | null;
  score2?: number | null;
  firstOpponent: MatchOpponentLike;
  secondOpponent: MatchOpponentLike;
};

export const mapMatchListItem = (m: MatchListItemLike): MatchListItem => {
  return {
    id: m.id,
    date: String(m.date),
    status: m.status,
    ...(m.score1 == null ? {} : { score1: m.score1 }),
    ...(m.score2 == null ? {} : { score2: m.score2 }),
    firstOpponent: { id: m.firstOpponent.id, name: m.firstOpponent.name ?? '' },
    secondOpponent: { id: m.secondOpponent.id, name: m.secondOpponent.name ?? '' },
  };
};
