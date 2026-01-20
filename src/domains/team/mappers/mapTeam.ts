import { Team } from '../contracts';
import { GetTeamsQuery, TeamsWithPlayersQuery, GetPlayersStandingsQuery, TeamByIdQuery } from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';

export const mapTeam = (
  team:
    | GetTeamsQuery['teams'][number]
    | TeamsWithPlayersQuery['teams'][number]
    | GetPlayersStandingsQuery['teams'][number]
    | TeamByIdQuery['teamById'],
): Team => {
  const players = 'players' in team ? team.players.map(mapPlayer) : [];
  const captain = 'captain' in team && team.captain ? mapPlayer(team.captain) : undefined;
  
  return {
    id: team.id,
    name: team.name,
    players,
    captain,
  };
};
