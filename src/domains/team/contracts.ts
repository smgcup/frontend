import type { Player } from '../player/contracts';
import type { Match } from '../matches/contracts';

export type Team = {
  id: string;
  name: string;
  players?: Player[];
  captain?: Player;
  matches?: Match[];
};
