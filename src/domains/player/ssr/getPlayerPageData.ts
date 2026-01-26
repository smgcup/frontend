import { getClient } from '@/lib/initializeApollo';
import {
  PlayerByIdDocument,
  PlayerByIdQuery,
  PlayerByIdQueryVariables,
  GetMatchesDocument,
  GetMatchesQuery,
  GetMatchesQueryVariables,
} from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import type { Player } from '@/domains/player/contracts';
import type { Match } from '@/domains/matches/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export async function getPlayerPageData(playerId: string): Promise<{ player: Player | null; error: string | null }> {
  const client = await getClient();

  try {
    // Fetch player and matches in parallel
    const [playerResult, matchesResult] = await Promise.all([
      client.query<PlayerByIdQuery, PlayerByIdQueryVariables>({
        query: PlayerByIdDocument,
        variables: { id: playerId },
      }),
      client.query<GetMatchesQuery, GetMatchesQueryVariables>({
        query: GetMatchesDocument,
      }),
    ]);

    const { data, error } = playerResult;

    if (error || !data?.playerById) {
      const errorMessage = error
        ? 'Failed to load player information. Please try again later.'
        : 'Player not found. The player you are looking for does not exist.';
      return { player: null, error: errorMessage };
    }

    // Map GraphQL response to domain Player model
    const player = mapPlayer(data.playerById);

    // If player has a team, filter matches for that team
    let teamMatches: Match[] = [];
    if (player.team) {
      const allMatches = matchesResult.data?.matches ?? [];
      teamMatches = allMatches
        .filter((match) => match.firstOpponent.id === player.team!.id || match.secondOpponent.id === player.team!.id)
        .map(mapMatch)
        // Sort by date, most recent first
        .sort((a, b) => (b.date ? new Date(b.date).getTime() - new Date(a.date ?? '').getTime() : 0));
    }

    return {
      player: {
        ...player,
        matches: teamMatches,
      },
      error: null,
    };
  } catch (err) {
    return { player: null, error: getErrorMessage(err) };
  }
}
