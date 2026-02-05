import { MatchStatus } from '@/graphql';
import type { MatchEventType, MatchLocation } from '@/generated/types';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';

export type MatchMvp = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Match = {
  id: string;
  firstOpponent: Team;
  secondOpponent: Team;
  date?: string | null;
  status: MatchStatus;
  score1?: number;
  score2?: number;
  round: number;
  location?: MatchLocation | null;
  mvp?: MatchMvp | null;
};

export type MatchEvent = {
  id: string;
  type: MatchEventType;
  minute: number;
  createdAt: string;
  player?: Player;
  assistPlayer?: Player;
};
