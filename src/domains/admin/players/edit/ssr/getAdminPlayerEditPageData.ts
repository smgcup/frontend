import { getClient } from '@/lib/initializeApollo';
import { TeamsWithPlayersDocument, type TeamsWithPlayersQuery } from '@/graphql';
import { mapTeamFromQuery } from '@/domains/player/mappers/mapTeamFromQuery';
import { mapPlayerEdit } from './mappers/mapPlayerEdit';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';

export const getAdminPlayerEditPageData = async (playerId: string) => {
  const client = await getClient();

  // SSR: fetch teams (and nested players) on the server so the edit page can render with data
  // without running a client-side useQuery (mirrors the create page SSR approach).
  const { data: teamsData, error: teamsError } = await client.query<TeamsWithPlayersQuery>({
    query: TeamsWithPlayersDocument,
  });

  const teamsRows = teamsData?.teams ?? [];
  const teams: Team[] = teamsRows.map(mapTeamFromQuery);

  // Derive the player by scanning the nested teams -> players structure.
  // If not found, return undefined; the UI can render a "Player not found" state.
  let player: Player | undefined = undefined;
  for (const team of teamsRows) {
    const found = (team.players ?? []).find((p) => p.id === playerId);
    if (found) {
      player = mapPlayerEdit(found, { id: team.id, name: team.name });
      break;
    }
  }

  // Match the create page helper: normalize any Apollo error into a string message.
  const teamsErrorMessage = teamsError
    ? typeof teamsError === 'object' && teamsError && 'message' in teamsError
      ? String((teamsError as { message?: unknown }).message ?? 'Failed to load teams.')
      : 'Failed to load teams.'
    : null;

  return { teams, player, teamsErrorMessage };
};
