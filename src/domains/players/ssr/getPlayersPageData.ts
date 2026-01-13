import { getClient } from '@/lib/initializeApollo';
import { TeamsWithPlayersDocument, TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import type { PlayersPageData } from '../contracts';
import { CATEGORIES } from '../constants';

export const getPlayersPageData = async (): Promise<PlayersPageData> => {
  const client = await getClient();

  const { data } = await client.query<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>({
    query: TeamsWithPlayersDocument,
  });

  const teams = (data?.teams ?? []).map(mapTeam);

  const allPlayers = teams.flatMap((team) =>
    (team.players ?? []).map((player) => ({
      ...player,
      teamName: team.name,
    })),
  );

  const standings = Object.values(CATEGORIES).map((cat) => {
    return {
      title: cat,
      players: allPlayers.map((player, index) => ({
        ...player,
        rank: index + 1,
      })),
    };
  });

  return { standings };
};
