import { getClient } from '@/lib/initializeApollo';
import { TeamsWithPlayersDocument, type TeamsWithPlayersQuery } from '@/graphql';
import { mapTeamWithPlayers } from '@/domains/team/mappers/mapTeamWithPlayers';
import type { TeamWithPlayers } from '@/domains/team/contracts';

export const getAdminTeamsListPageData = async () => {
  const client = await getClient();

  // SSR: fetch teams (with nested players) on the server so the list page can
  // render immediately without running a client-side useQuery.
  const { data: teamsData, error: teamsError } = await client.query<TeamsWithPlayersQuery>({
    query: TeamsWithPlayersDocument,
  });

  const teamsRows = teamsData?.teams ?? [];
  const teams: TeamWithPlayers[] = teamsRows.map(mapTeamWithPlayers);

  const teamsErrorMessage = teamsError
    ? typeof teamsError === 'object' && teamsError && 'message' in teamsError
      ? String((teamsError as { message?: unknown }).message ?? 'Failed to load teams.')
      : 'Failed to load teams.'
    : null;

  return { teams, teamsErrorMessage };
};

