import { getClient } from '@/lib/initializeApollo';
import {
  MatchByIdDocument,
  type MatchByIdQuery,
  type MatchByIdQueryVariables,
  PlayerAppearancesByMatchDocument,
  type PlayerAppearancesByMatchQuery,
  type PlayerAppearancesByMatchQueryVariables,
} from '@/graphql';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';

export type ExistingAppearance = {
  playerId: string;
  level: number;
};

export const getAdminMatchAppearancesPageData = async (matchId: string) => {
  const client = await getClient();

  const [matchResult, appearancesResult] = await Promise.all([
    client.query<MatchByIdQuery, MatchByIdQueryVariables>({
      query: MatchByIdDocument,
      variables: { id: matchId },
    }),
    client.query<PlayerAppearancesByMatchQuery, PlayerAppearancesByMatchQueryVariables>({
      query: PlayerAppearancesByMatchDocument,
      variables: { matchId },
    }),
  ]);

  const { data: matchData, error: matchError } = matchResult;
  const { data: appearancesData } = appearancesResult;

  if (!matchData || !matchData.matchById) {
    return { match: null, existingAppearances: [], mvpId: null, errorMessage: 'Match not found' };
  }

  const match = mapMatch(matchData.matchById);
  const mvpId = matchData.matchById.mvp?.id ?? null;

  const existingAppearances: ExistingAppearance[] = (appearancesData?.playerAppearancesByMatch ?? []).map((a) => ({
    playerId: a.playerId,
    level: a.level,
  }));

  // getErrorMessage from @/domains/admin/utils/getErrorMessage always returns a string (never null)
  // this logic needs null when there is no error to control UI rendering
  // so using it directly changes the type from `string | null` to just `string`
  const errorMessage = matchError
    ? typeof matchError === 'object' && matchError && 'message' in matchError
      ? String((matchError as { message?: unknown }).message ?? 'Failed to load match.')
      : 'Failed to load match.'
    : null;

  return { match, existingAppearances, mvpId, errorMessage };
};
