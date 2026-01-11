import type { Player } from '@/domains/player/contracts';
import type { CreatePlayerDto } from '@/graphql';

export const mapPlayerCreateToDto = (input: Player): CreatePlayerDto => {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    teamId: input.teamId!,
    height: input.height,
    weight: input.weight,
    yearOfBirth: input.yearOfBirth,
    imageUrl: input.imageUrl ?? undefined,
    position: input.position as CreatePlayerDto['position'],
    preferredFoot: input.preferredFoot as CreatePlayerDto['preferredFoot'],
  };
};
