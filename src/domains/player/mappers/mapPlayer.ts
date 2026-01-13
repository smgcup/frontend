import { Player } from '../contracts';
import { MatchByIdQuery, PlayerByIdQuery } from '@/graphql';
export const mapPlayer = (
  player:
    | PlayerByIdQuery['playerById']
    | MatchByIdQuery['matchById']['firstOpponent']['players'][number]
    | MatchByIdQuery['matchById']['secondOpponent']['players'][number],
): Player => {
  //   if (!player) return null;

  const height = 'height' in player ? player.height : undefined;
  const weight = 'weight' in player ? player.weight : undefined;
  const preferredFoot = 'preferredFoot' in player ? player.preferredFoot : undefined;
  const team = 'team' in player ? { id: player.team.id, name: player.team.name } : undefined;
  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    height,
    weight,
    preferredFoot,
    team,
  };
};
