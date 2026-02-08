export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type JerseyStyle = {
  color: string;
  textColor: string;
  label: string;
};

export type FantasyPlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  points: number;
  jersey: JerseyStyle;
  isCaptain?: boolean;
};

export type FantasyTeamData = {
  teamName?: string;
  gameweek: number;
  gameweekDate: string;

  // Header stats (optional for now; UI will fall back if absent)
  latestPoints?: number;
  averagePoints?: number;
  highestPoints?: number;
  gwRank?: number;
  transfers?: number;

  freeTransfers: number;
  cost: number;
  budget: number;
  starters: FantasyPlayer[];
  bench: FantasyPlayer[];
};
