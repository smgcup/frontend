import { getClient } from '@/lib/initializeApollo';
import {
  PlayerByIdDocument,
  PlayerByIdQuery,
  PlayerByIdQueryVariables,
} from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';
import type { Player } from '@/domains/player/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export async function getPlayerPageData(playerId: string): Promise<{ player: Player | null; error: string | null }> {
  const client = await getClient();

  try {
    const { data, error } = await client.query<PlayerByIdQuery, PlayerByIdQueryVariables>({
      query: PlayerByIdDocument,
      variables: { id: playerId },
    });

    if (error || !data?.playerById) {
      const errorMessage = error
        ? 'Failed to load player information. Please try again later.'
        : 'Player not found. The player you are looking for does not exist.';
      return { player: null, error: errorMessage };
    }

    // Map GraphQL response to domain Player model
    const player = mapPlayer(data.playerById);

    return {
      player,
      error: null,
    };
  } catch (err) {
    return { player: null, error: getErrorMessage(err) };
  }
}
