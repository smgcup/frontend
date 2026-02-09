import { getClient } from '@/lib/initializeApollo';
import {
  TeamsWithPlayersDocument,
  type TeamsWithPlayersQuery,
  GetFantasyPlayersDocument,
  type GetFantasyPlayersQuery,
} from '@/graphql';
import type { PlayerPriceEntry } from '../contracts';

export const getAdminPlayerPricesPageData = async () => {
  const client = await getClient();

  const [teamsResult, fantasyResult] = await Promise.all([
    client.query<TeamsWithPlayersQuery>({ query: TeamsWithPlayersDocument }),
    client.query<GetFantasyPlayersQuery>({ query: GetFantasyPlayersDocument }),
  ]);

  const fantasyMap = new Map(
    (fantasyResult.data?.fantasyPlayers ?? []).map((fp) => [
      fp.playerId,
      { displayName: fp.displayName, price: fp.price },
    ]),
  );

  const teams = teamsResult.data?.teams ?? [];
  const players: PlayerPriceEntry[] = teams.flatMap((team) =>
    (team.players ?? []).map((player) => ({
      playerId: player.id,
      firstName: player.firstName,
      lastName: player.lastName,
      position: player.position ?? undefined,
      teamName: team.name,
      displayName: fantasyMap.get(player.id)?.displayName ?? null,
      price: fantasyMap.has(player.id) ? String(fantasyMap.get(player.id)!.price) : '',
      hasFantasyData: fantasyMap.has(player.id),
    })),
  );

  const errorMessage = teamsResult.error?.message ?? fantasyResult.error?.message ?? null;

  return { players, errorMessage };
};
