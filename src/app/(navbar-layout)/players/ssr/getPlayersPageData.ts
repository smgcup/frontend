import { getClient } from '@/lib/initializeApollo';
import { TeamsWithPlayersDocument, type TeamsWithPlayersQuery } from '@/graphql';
import { mapTeamWithPlayers } from '@/domains/team/mappers/mapTeamWithPlayers';
import type { Player } from '@/domains/player/contracts';

export type PlayerStanding = Player & {
  teamName: string;
  statValue: number;
  rank: number;
};

export type StandingsCategory = {
  title: string;
  players: PlayerStanding[];
};

export type PlayersPageData = {
  standings: StandingsCategory[];
};

export const getPlayersPageData = async (): Promise<PlayersPageData> => {
  const client = await getClient();
  const { data } = await client.query<TeamsWithPlayersQuery>({
    query: TeamsWithPlayersDocument,
  });

  const teams = (data?.teams ?? []).map(mapTeamWithPlayers);

  // Flatten all players
  const allPlayers = teams.flatMap((team) =>
    team.players.map((player) => ({
      ...player,
      teamName: team.name,
    })),
  );

  // Mock stats categories
  const categories = [
    { title: 'Goals', max: 25 },
    { title: 'Assists', max: 15 },
    { title: 'Total Passes', max: 2000 },
    { title: 'Clean Sheets', max: 15 },
  ];

  const standings: StandingsCategory[] = categories.map((cat) => {
    // Shuffle players to pick random ones for each category
    const shuffled = [...allPlayers].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10); // Top 10

    // Assign mock values sorted descending
    const playersWithStats = selected.map((p, index) => {
      // Simple mock value generation: decrease as rank increases
      const value = Math.floor(cat.max * (1 - index * 0.08) * (0.9 + Math.random() * 0.1));
      return {
        ...p,
        statValue: Math.max(0, value),
        rank: index + 1,
      };
    });

    // Sort just in case the random factor messed up order, though we want rough order
    playersWithStats.sort((a, b) => b.statValue - a.statValue);

    // Re-assign ranks
    const ranked = playersWithStats.map((p, i) => ({ ...p, rank: i + 1 }));

    return {
      title: cat.title,
      players: ranked,
    };
  });

  return { standings };
};
