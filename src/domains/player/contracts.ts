import type { Team } from '../team/contracts';
import type { PlayerPosition, PreferredFoot } from '@/graphql';

export type Player = {
  id: string;
  team?: Team;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  yearOfBirth?: number;
  height?: number;
  weight?: number;
  preferredFoot?: PreferredFoot;
  imageUrl?: string | null;
};
