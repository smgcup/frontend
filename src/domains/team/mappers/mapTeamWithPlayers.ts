import type { TeamWithPlayers } from '../contracts';
import { mapPlayerListItem } from '@/domains/player/mappers/mapPlayerListItem';
import type { PlayerLike } from '@/domains/player/mappers/types';

type TeamLike = {
  id: string;
  name?: string | null;
  players?: PlayerLike[] | null;
};

export const mapTeamWithPlayers = (team: TeamLike): TeamWithPlayers => {
  const playersArray = team.players ?? [];

  return {
    id: team.id,
    name: team.name ?? '',
    players: playersArray.map(mapPlayerListItem),
  };
};
