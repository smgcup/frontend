import { getPlayerByIdData, getMatchesData } from '@/lib/cachedQueries';
import type { Player } from '@/domains/player/contracts';
import type { Match } from '@/domains/matches/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export async function getPlayerPageData(playerId: string): Promise<{ player: Player | null; error: string | null }> {
  try {
    const [player, allMatches] = await Promise.all([getPlayerByIdData(playerId), getMatchesData()]);

    if (!player) {
      return { player: null, error: 'Player not found. The player you are looking for does not exist.' };
    }

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
