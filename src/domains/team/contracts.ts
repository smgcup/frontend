import type { Player } from '../player/contracts';
import type { Match } from '../matches/contracts';

export type TeamStats = {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
};

export type Team = {
  id: string;
  name: string;
  players?: Player[];
  captain?: Player;
  matches?: Match[];
  stats?: TeamStats;
};
