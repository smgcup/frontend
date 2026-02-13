import type { Match } from '../contracts';
import { type MatchByIdQuery, type GetMatchesQuery } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';

type MatchInput = GetMatchesQuery['matches'][number] | MatchByIdQuery['matchById'];

export const mapMatch = (match: MatchInput): Match => {
  const mvpData = 'mvp' in match && match.mvp ? mapPlayer(match.mvp) : null;
  const mvp = mvpData ?? null;

  return {
    id: match.id,
    firstOpponent: mapTeam(match.firstOpponent),
    secondOpponent: mapTeam(match.secondOpponent),
    date: match.date ? String(match.date) : undefined,
    status: match.status,
    score1: match.score1 ?? undefined,
    score2: match.score2 ?? undefined,
    round: match.round,
    fdr1: 'fdr1' in match ? (match.fdr1 ?? null) : null,
    fdr2: 'fdr2' in match ? (match.fdr2 ?? null) : null,
    location: match.location ?? undefined,
    mvp,
  };
};
