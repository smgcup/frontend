import { Team } from '../contracts';
import { GetTeamsQuery, TeamsWithPlayersQuery, GetPlayerStandingsQuery, TeamByIdQuery } from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';

export const mapTeam = (
  team:
    | GetTeamsQuery['teams'][number]
    | TeamsWithPlayersQuery['teams'][number]
    | GetPlayerStandingsQuery['teams'][number]
    | TeamByIdQuery['teamById'],
): Team => {
  const players = 'players' in team ? team.players.map(mapPlayer) : undefined;
  const captain = 'captain' in team && team.captain ? mapPlayer(team.captain) : undefined;

  const stats = 'stats' in team && team.stats ? team.stats : undefined;

  return {
    id: team.id,
    name: team.name,
    players,
    captain,
    stats,
  };
};
