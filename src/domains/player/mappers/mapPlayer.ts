import { Player } from '../contracts';
import { MatchByIdQuery, PlayerByIdQuery } from '@/graphql';
export const mapPlayer = (
  player:
    | PlayerByIdQuery['playerById']
    | MatchByIdQuery['matchById']['firstOpponent']['players'][number]
    | MatchByIdQuery['matchById']['secondOpponent']['players'][number],
): Player => {
  //   if (!player) return null;

  const yearOfBirth = 'yearOfBirth' in player ? player.yearOfBirth : undefined;
  const height = 'height' in player ? player.height : undefined;
  const weight = 'weight' in player ? player.weight : undefined;
  const preferredFoot = 'preferredFoot' in player ? player.preferredFoot : undefined;

  return {
    id: player.id,
    firstName: player.firstName,
    lastName: player.lastName,
    position: player.position,
    yearOfBirth,
    height,
    weight,
    preferredFoot,
  };
};
