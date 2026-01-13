import { MatchStatus } from '@/graphql';
import type { MatchEventType } from '@/generated/types';
import type { Team } from '@/domains/team/contracts';

export type MatchPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
};
export type Match = {
  id: string;
  firstOpponent: Team;
  secondOpponent: Team;
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
