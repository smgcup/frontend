import type { Team, TeamWithPlayers } from '../contracts';
import { mapPlayerListItem } from './mapPlayerListItem';

export const mapTeamWithPlayers = (team: Team): TeamWithPlayers => {
  const playersArray = team.players ?? [];

  return {
    id: team.id,
    name: team.name ?? '',
    players: playersArray.map(mapPlayerListItem),
  };
};
