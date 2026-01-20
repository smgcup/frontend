import { Player } from '../contracts';
import {
  MatchByIdQuery,
  PlayerByIdQuery,
  TeamsWithPlayersQuery,
  MatchEventsQuery,
  GetPlayersStandingsQuery,
  TeamByIdQuery,
} from '@/graphql';

export const mapPlayer = (
  player:
    | PlayerByIdQuery['playerById']
    | MatchByIdQuery['matchById']['firstOpponent']['players'][number]
    | MatchByIdQuery['matchById']['secondOpponent']['players'][number]
    | TeamsWithPlayersQuery['teams'][number]['players'][number]
    | GetPlayersStandingsQuery['teams'][number]['players'][number]
    | NonNullable<TeamByIdQuery['teamById']['captain']>
    | NonNullable<MatchEventsQuery['matchEvents'][number]['player']>
    | NonNullable<MatchEventsQuery['matchEvents'][number]['assistPlayer']>,
): Player => {
  // if (!player) return null;

  const height = 'height' in player ? player.height : undefined;
  const weight = 'weight' in player ? player.weight : undefined;
  const preferredFoot = 'preferredFoot' in player ? player.preferredFoot : undefined;
  const team = 'team' in player ? { id: player.team.id, name: player.team.name } : undefined;
  const age = 'age' in player ? player.age : undefined;
  const imageUrl = 'imageUrl' in player ? player.imageUrl : undefined;

  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    height,
    weight,
    preferredFoot,
    team,
    age,
    imageUrl,
  };
};
