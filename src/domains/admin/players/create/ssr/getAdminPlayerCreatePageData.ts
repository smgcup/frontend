import { getClient } from '@/lib/initializeApollo';
import { GetTeamsDocument, type GetTeamsQuery } from '@/graphql';
import { mapTeamFromQuery } from '@/domains/player/mappers/mapTeamFromQuery';
import type { Team } from '@/domains/team/contracts';

export const getAdminPlayerCreatePageData = async () => {
  const client = await getClient();

  const { data: teamsData, error: teamsError } = await client.query<GetTeamsQuery>({
    query: GetTeamsDocument,
  });

  const teamsRows = teamsData?.teams ?? [];
  const teams: Team[] = teamsRows.map(mapTeamFromQuery);

  const teamsErrorMessage = teamsError
    ? typeof teamsError === 'object' && teamsError && 'message' in teamsError
      ? String((teamsError as { message?: unknown }).message ?? 'Failed to load teams.')
      : 'Failed to load teams.'
    : null;

  return { teams, teamsErrorMessage };
};
