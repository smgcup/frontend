import type { Player } from '../player/contracts';

export type Team = {
  id: string;
  name: string;
  players?: Player[];
};
