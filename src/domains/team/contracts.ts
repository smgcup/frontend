import type { Player } from '../player/contracts';
import type { Match } from '../matches/contracts';

export type TeamStats = {
  points: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  goalsConceded: number;
  wins: number;
  draws: number;
  losses: number;
  cleanSheets: number;
  matchesPlayed: number;
};

export type Team = {
  id: string;
  name: string;
  players?: Player[];
  captain?: Player;
  matches?: Match[];
  stats?: TeamStats;
};
