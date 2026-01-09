import type { PlayerCreate } from '@/domains/player/contracts';
import type { CreatePlayerDto } from '@/graphql';

// Note: API uses `prefferedFoot` (typo). Keep domain contract clean and map here.
export const mapPlayerCreateToDto = (input: PlayerCreate): CreatePlayerDto => {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    teamId: input.teamId,
    height: input.height,
    weight: input.weight,
    yearOfBirth: input.yearOfBirth,
    imageUrl: input.imageUrl,
    position: input.position as CreatePlayerDto['position'],
    prefferedFoot: input.preferredFoot as CreatePlayerDto['prefferedFoot'],
  };
};
