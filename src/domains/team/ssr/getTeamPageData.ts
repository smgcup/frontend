import { getTeamByIdData, getMatchesData } from '@/lib/cachedQueries';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export async function getTeamPageData(teamId: string): Promise<{ team: Team | null; error: string | null }> {
  try {
    const [team, allMatches] = await Promise.all([getTeamByIdData(teamId), getMatchesData()]);

    if (!team) {
      return { team: null, error: 'Team not found. The team you are looking for does not exist.' };
    }

    // Transform domain Team - ensure players is always an array
    const players: Player[] = (team.players || []).map((player) => ({
      ...player,
      age: player.age ?? 0,
    }));

    const captain: Player | undefined = team.captain
      ? {
          ...team.captain,
          age: team.captain.age ?? 0,
        }
      : undefined;

    // Filter matches for this team (where team is either first or second opponent)
    const teamMatches = allMatches
      .filter((match) => match.firstOpponent.id === teamId || match.secondOpponent.id === teamId)
      // Sort by date, most recent first
      .sort((a, b) => (b.date ? new Date(b.date).getTime() - new Date(a.date ?? '').getTime() : 0));

    return {
      team: {
        id: team.id,
        name: team.name,
        players,
        captain,
        matches: teamMatches,
        stats: team.stats,
      },
      error: null,
    };
  } catch (err) {
    return { team: null, error: getErrorMessage(err) };
  }
}
