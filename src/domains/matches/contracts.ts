import { MatchStatus } from '@/graphql';
import type { MatchEventType } from '@/generated/types';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';

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
  player?: Player;
  assistPlayer?: Player;
};
