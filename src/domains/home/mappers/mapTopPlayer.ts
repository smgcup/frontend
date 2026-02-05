import { Player, PlayerStats } from '@/domains/player/contracts';
import { GetTopPlayersQuery } from '@/graphql';

const parseName = (name: string): { firstName: string; lastName: string } => {
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' ') ?? '',
  };
};

export const mapTopPlayer = (player: GetTopPlayersQuery['topPlayers'][number]): Player => {
  const { firstName, lastName } = parseName(player.name);
  const stats: PlayerStats = {
    appearances: 0,
    goals: player.goals,
    assists: player.assists,
    yellowCards: player.yellowCards,
    redCards: player.redCards,
    ownGoals: player.ownGoals,
    penaltiesMissed: 0,
    penaltiesScored: 0,
    goalkeeperSaves: 0,
  };
  return {
    id: player.id,
    team: { id: player.teamId, name: player.teamName },
    firstName,
    lastName,
    position: player.position,
    stats,
  };
};
