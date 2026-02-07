import type { Team } from '../team/contracts';
import type { Match } from '../matches/contracts';
import type { PlayerPosition, PreferredFoot } from '@/graphql';

export type PlayerStats = {
  appearances: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  penaltiesMissed: number;
  penaltiesScored: number;
  goalkeeperSaves: number;
  cleanSheets: number;
};

export type Player = {
  id: string;
  team?: Team;
  firstName: string;
  lastName: string;
  position?: PlayerPosition;
  dateOfBirth?: string;
  age?: number;
  height?: number;
  weight?: number;
  preferredFoot?: PreferredFoot;
  imageUrl?: string | null;
  class?: string | null;
  matches?: Match[];
  stats?: PlayerStats;
};
