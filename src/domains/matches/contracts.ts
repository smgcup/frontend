export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED';

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

export enum MatchEventType {
  GOAL = 'GOAL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  GOALKEEPER_SAVE = 'GOALKEEPER_SAVE',
  PENALTY_SCORED = 'PENALTY_SCORED',
  PENALTY_MISSED = 'PENALTY_MISSED',
  HALF_TIME = 'HALF_TIME',
  FULL_TIME = 'FULL_TIME',
}

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
