import { getClient } from '@/lib/initializeApollo';
import {
  TeamByIdDocument,
  TeamByIdQuery,
  TeamByIdQueryVariables,
  GetMatchesDocument,
  GetMatchesQuery,
  GetMatchesQueryVariables,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

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

    return {
      team: {
        id: team.id,
        name: team.name,
        players,
        captain,
        matches: teamMatches,
      },
      error: null,
    };
  } catch (err) {
    return { team: null, error: getErrorMessage(err) };
  }
}
