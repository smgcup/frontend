import { getPublicClient } from '@/lib/initializeApollo';
import { PlayerByIdDocument, GetMatchesDocument } from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import type { Player } from '@/domains/player/contracts';
import type { Match } from '@/domains/matches/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export async function getPlayerPageData(playerId: string): Promise<{ player: Player | null; error: string | null }> {
  try {
    const client = getPublicClient();

    const [playerResult, matchesResult] = await Promise.all([
      client.query({ query: PlayerByIdDocument, variables: { id: playerId } }),
      client.query({ query: GetMatchesDocument }),
    ]);

    if (!playerResult.data?.playerById) {
      return { player: null, error: 'Player not found. The player you are looking for does not exist.' };
    }

    const player = mapPlayer(playerResult.data.playerById);
    const allMatches = matchesResult.data?.matches.map(mapMatch) ?? [];

    // If player has a team, filter matches for that team
    let teamMatches: Match[] = [];
    if (player.team) {
      teamMatches = allMatches
        .filter((match) => match.firstOpponent.id === player.team!.id || match.secondOpponent.id === player.team!.id)
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
