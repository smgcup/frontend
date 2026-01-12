import { MatchStatus } from '@/graphql';
import type { MatchEventType } from '@/generated/types';

export type MatchOpponent = {
  id: string;
  name: string;
};

export type MatchListItem = {
  id: string;
  date: string;
  status: MatchStatus;
  score1?: number;
  score2?: number;
  firstOpponent: MatchOpponent;
  secondOpponent: MatchOpponent;
};

export type MatchPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
};

export type MatchTeam = {
  id: string;
  name: string;
  players: MatchPlayer[];
};

export type Match = {
  id: string;
  firstOpponent: MatchTeam;
  secondOpponent: MatchTeam;
  date: string;
  status: MatchStatus;
  score1?: number;
  score2?: number;
};

export type MatchEvent = {
  id: string;
  type: MatchEventType;
  minute: number;
  payload?: unknown;
  createdAt?: string;
  player?: MatchPlayer;
  team: {
    id: string;
    name: string;
  };
};
