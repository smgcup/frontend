import { getTeamByIdData, getMatchesData } from '@/lib/cachedQueries';
import { MatchStatus } from '@/graphql';
import type { Player } from '@/domains/player/contracts';
import type { Team, TeamStats } from '@/domains/team/contracts';
import type { Match } from '@/domains/matches/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

function calculateTeamStats(teamId: string, matches: Match[]): TeamStats {
  const finishedMatches = matches.filter((m) => m.status === MatchStatus.Finished);

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;
  let cleanSheets = 0;

  for (const match of finishedMatches) {
    const isFirstOpponent = match.firstOpponent.id === teamId;
    const teamGoals = isFirstOpponent ? (match.score1 ?? 0) : (match.score2 ?? 0);
    const opponentGoals = isFirstOpponent ? (match.score2 ?? 0) : (match.score1 ?? 0);

    goalsScored += teamGoals;
    goalsConceded += opponentGoals;

    if (opponentGoals === 0) {
      cleanSheets++;
    }

    if (teamGoals > opponentGoals) {
      wins++;
    } else if (teamGoals < opponentGoals) {
      losses++;
    } else {
      draws++;
    }
  }

  return {
    matchesPlayed: finishedMatches.length,
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
    cleanSheets,
  };
}

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

    const stats = calculateTeamStats(teamId, teamMatches);

    return {
      team: {
        id: team.id,
        name: team.name,
        players,
        captain,
        matches: teamMatches,
        stats,
      },
      error: null,
    };
  } catch (err) {
    return { team: null, error: getErrorMessage(err) };
  }
}
