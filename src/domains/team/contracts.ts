import type { Player } from '../player/contracts';

export type Team = {
  id: string;
  name: string;
  players: Player[];
};

export type TeamWithPlayers = {
  id: string;
  name: string;
  players: Player[];
};

export type TeamCreate = {
  name: string;
};

export type TeamUpdate = {
  name: string;
};
