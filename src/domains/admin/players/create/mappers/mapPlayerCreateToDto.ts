import type { CreatePlayerDto } from '@/graphql';

export const mapPlayerCreateToDto = (input: CreatePlayerDto): CreatePlayerDto => {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    teamId: input.teamId,
    height: input.height,
    weight: input.weight,
    yearOfBirth: input.yearOfBirth,
    imageUrl: input.imageUrl ?? undefined,
    position: input.position,
    preferredFoot: input.preferredFoot,
  };
};
