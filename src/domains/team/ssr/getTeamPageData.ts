import { getClient } from '@/lib/initializeApollo';
import {
  TeamByIdDocument,
  TeamByIdQuery,
  TeamByIdQueryVariables,
  GetMatchesDocument,
  GetMatchesQuery,
  GetMatchesQueryVariables,
  MatchStatus,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
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
  const client = await getClient();

  try {
    // Fetch team and matches in parallel
    const [teamResult, matchesResult] = await Promise.all([
      client.query<TeamByIdQuery, TeamByIdQueryVariables>({
        query: TeamByIdDocument,
        variables: { id: teamId },
      }),
      client.query<GetMatchesQuery, GetMatchesQueryVariables>({
        query: GetMatchesDocument,
      }),
    ]);

    const { data, error } = teamResult;

    if (error || !data?.teamById) {
      const errorMessage = error
        ? 'Failed to load team information. Please try again later.'
        : 'Team not found. The team you are looking for does not exist.';
      return { team: null, error: errorMessage };
    }

    // Map GraphQL response to domain Team model
    const team = mapTeam(data.teamById);

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
    const allMatches = matchesResult.data?.matches ?? [];
    const teamMatches = allMatches
      .filter((match) => match.firstOpponent.id === teamId || match.secondOpponent.id === teamId)
      .map(mapMatch)
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
