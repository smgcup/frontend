import { Team } from '../contracts';
import { GetTeamsQuery, TeamsWithPlayersQuery, GetPlayersStandingsQuery } from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';

export const mapTeam = (
  team:
    | GetTeamsQuery['teams'][number]
    | TeamsWithPlayersQuery['teams'][number]
    | GetPlayersStandingsQuery['teams'][number],
): Team => {
  const players = 'players' in team ? team.players.map(mapPlayer) : [];

  return {
    id: team.id,
    name: team.name,
    players,
  };
};
