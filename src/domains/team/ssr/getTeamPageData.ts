import { getClient } from '@/lib/initializeApollo';
import { TeamByIdDocument, TeamByIdQuery, TeamByIdQueryVariables } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export async function getTeamPageData(teamId: string): Promise<{ team: Team | null; error: string | null }> {
  const client = await getClient();

  try {
    const { data, error } = await client.query<TeamByIdQuery, TeamByIdQueryVariables>({
      query: TeamByIdDocument,
      variables: { id: teamId },
    });

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

    return {
      team: {
        id: team.id,
        name: team.name,
        players,
        captain,
      },
      error: null,
    };
  } catch (err) {
    return { team: null, error: getErrorMessage(err) };
  }
}
