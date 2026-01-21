import { getClient } from '@/lib/initializeApollo';
import { TeamByIdDocument, TeamByIdQuery, TeamByIdQueryVariables } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';

export async function getTeamPageData(teamId: string): Promise<Team> {
  const client = await getClient();

  const { data, error } = await client.query<TeamByIdQuery, TeamByIdQueryVariables>({
    query: TeamByIdDocument,
    variables: { id: teamId },
  });

  if (error || !data?.teamById) {
    throw error || new Error('Team not found');
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
    id: team.id,
    name: team.name,
    players,
    captain,
  };
}
