import { TopPlayer } from '../contracts';
import { GetTopPlayersQuery } from '@/graphql';

const shortenPosition = (position: string): string => {
  const map: Record<string, string> = {
    GOALKEEPER: 'GK',
    DEFENDER: 'DEF',
    MIDFIELDER: 'MID',
    FORWARD: 'FWD',
  };
  return map[position] ?? position;
};

export const mapTopPlayer = (player: GetTopPlayersQuery['topPlayers'][number]): TopPlayer => ({
  id: player.id,
  name: player.name,
  teamId: player.teamId,
  teamName: player.teamName,
  position: shortenPosition(player.position),
  goals: player.goals,
  assists: player.assists,
  yellowCards: player.yellowCards,
  redCards: player.redCards,
  ownGoals: player.ownGoals,
});
