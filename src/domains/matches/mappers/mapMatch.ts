import type { Match } from '../contracts';
import { type MatchByIdQuery, type GetMatchesQuery } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';

export const mapMatch = (match: GetMatchesQuery['matches'][number] | MatchByIdQuery['matchById']): Match => {
  return {
    id: match.id,
    firstOpponent: mapTeam(match.firstOpponent),
    secondOpponent: mapTeam(match.secondOpponent),
    date: String(match.date),
    status: match.status,
    score1: match.score1 ?? undefined,
    score2: match.score2 ?? undefined,
  };
};
