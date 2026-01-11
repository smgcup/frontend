import type { Team } from '../team/contracts';
import type { PlayerPosition, PreferredFoot } from '@/graphql';

export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  yearOfBirth: number;
  height: number;
  weight: number;
  preferredFoot: PreferredFoot;
  imageUrl?: string | null;
  team?: Team;
  teamId?: string;
};

export type PlayerCreate = {
  firstName: string;
  lastName: string;
  teamId: string;
  position: PlayerPosition;
  yearOfBirth: number;
  height: number;
  weight: number;
  preferredFoot: PreferredFoot;
  imageUrl?: string;
};

export type PlayerUpdate = Partial<{
  firstName: string;
  lastName: string;
  teamId: string;
  height: number;
  weight: number;
  yearOfBirth: number;
  imageUrl: string;
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
}>;
