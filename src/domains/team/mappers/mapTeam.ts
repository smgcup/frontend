import { Team } from '../contracts';
import { GetTeamsQuery, TeamsWithPlayersQuery, GetPlayerStandingsQuery } from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';

export const mapTeam = (
  team:
    | GetTeamsQuery['teams'][number]
    | TeamsWithPlayersQuery['teams'][number]
    | GetPlayerStandingsQuery['teams'][number],
): Team => {
  const players = 'players' in team ? team.players.map(mapPlayer) : [];

  return {
    id: team.id,
    name: team.name,
    players,
  };
};
