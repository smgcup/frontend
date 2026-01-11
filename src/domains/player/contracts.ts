import type { Team } from '../team/contracts';
import type { PlayerPosition, PreferredFoot } from '@/graphql';

export type PlayerListItem = {
  id: string;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  yearOfBirth: number;
  height: number;
  weight: number;
  preferredFoot: PreferredFoot;
  imageUrl?: string | null;
};

export type PlayerEdit = {
  id: string;
  firstName: string;
  lastName: string;
  yearOfBirth: number;
  height: number;
  weight: number;
  imageUrl?: string | null;
  preferredFoot: PreferredFoot;
  position: PlayerPosition;
  team?: Team | null;
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

export type PlayerCreate = {
  firstName: string;
  lastName: string;
  teamId: string;
  height: number;
  weight: number;
  yearOfBirth: number;
  imageUrl: string;
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
};
