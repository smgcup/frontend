import type { Match, MatchMvp } from '../contracts';
import { type MatchByIdQuery, type GetMatchesQuery } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';

type MatchInput = GetMatchesQuery['matches'][number] | NonNullable<MatchByIdQuery['matchById']>;

export const mapMatch = (match: MatchInput): Match => {
  const mvpData = 'mvp' in match ? match.mvp : null;
  const mvp: MatchMvp | null = mvpData
    ? {
        id: mvpData.id,
        firstName: mvpData.firstName,
        lastName: mvpData.lastName,
      }
    : null;

  return {
    id: match.id,
    firstOpponent: mapTeam(match.firstOpponent),
    secondOpponent: mapTeam(match.secondOpponent),
    date: match.date ? String(match.date) : undefined,
    status: match.status,
    score1: match.score1 ?? undefined,
    score2: match.score2 ?? undefined,
    round: match.round,
    location: match.location ?? undefined,
    mvp,
  };
};
