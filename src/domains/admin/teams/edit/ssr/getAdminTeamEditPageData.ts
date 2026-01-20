import { getClient } from '@/lib/initializeApollo';
import { TeamByIdDocument, type TeamByIdQuery, type TeamByIdQueryVariables } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';

export const getAdminTeamEditPageData = async (teamId: string) => {
  const client = await getClient();

  const { data: teamData, error: teamError } = await client.query<TeamByIdQuery, TeamByIdQueryVariables>({
    query: TeamByIdDocument,
    variables: { id: teamId },
  });

  const team = teamData?.teamById ? mapTeam(teamData.teamById) : undefined;

  const teamErrorMessage = teamError
    ? typeof teamError === 'object' && teamError && 'message' in teamError
      ? String((teamError as { message?: unknown }).message ?? 'Failed to load team.')
      : 'Failed to load team.'
    : null;

  return { team, teamErrorMessage };
};
