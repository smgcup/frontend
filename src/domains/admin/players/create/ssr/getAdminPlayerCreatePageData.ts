import { getClient } from '@/lib/initializeApollo';
import { TeamsDocument, type TeamsQuery } from '@/graphql';
import { mapPlayerTeam } from '@/domains/player/mappers/mapPlayerTeam';
import type { PlayerTeam } from '@/domains/player/contracts';

export const getAdminPlayerCreatePageData = async () => {
  const client = await getClient();

  const { data: teamsData, error: teamsError } = await client.query<TeamsQuery>({
    query: TeamsDocument,
  });

  const teamsRows = teamsData?.teams ?? [];
  const teams: PlayerTeam[] = teamsRows.map(mapPlayerTeam);

  const teamsErrorMessage = teamsError
    ? typeof teamsError === 'object' && teamsError && 'message' in teamsError
      ? String((teamsError as { message?: unknown }).message ?? 'Failed to load teams.')
      : 'Failed to load teams.'
    : null;

  return { teams, teamsErrorMessage };
};
