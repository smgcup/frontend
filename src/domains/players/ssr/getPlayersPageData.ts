import { getClient } from '@/lib/initializeApollo';
import { GetPlayersStandingsDocument, type GetPlayersStandingsQuery } from '@/graphql';
import { mapTeamWithPlayers } from '@/domains/team/mappers/mapTeamWithPlayers';
import type { PlayersPageData, StandingsCategory } from '../contracts';

export const getPlayersPageData = async (): Promise<PlayersPageData> => {
  const client = await getClient();
  const { data } = await client.query<GetPlayersStandingsQuery>({
    query: GetPlayersStandingsDocument,
  });

  const teams = (data?.teams ?? []).map(mapTeamWithPlayers);

  const allPlayers = teams.flatMap((team) =>
    team.players.map((player) => ({
      ...player,
      teamName: team.name,
    })),
  );

  const categories = [
    { title: 'Goals', max: 25 },
    { title: 'Assists', max: 15 },
    { title: 'Total Passes', max: 2000 },
    { title: 'Clean Sheets', max: 15 },
  ];

  const standings: StandingsCategory[] = categories.map((cat) => {
    const shuffled = [...allPlayers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);

    const playersWithStats = selected.map((player, index) => {
      const value = Math.floor(cat.max * (1 - index * 0.08) * (0.9 + Math.random() * 0.1));
      return {
        ...player,
        statValue: Math.max(0, value),
        rank: index + 1,
      };
    });

    playersWithStats.sort((a, b) => b.statValue - a.statValue);
    const ranked = playersWithStats.map((player, index) => ({ ...player, rank: index + 1 }));

    return {
      title: cat.title,
      players: ranked,
    };
  });

  return { standings };
};
