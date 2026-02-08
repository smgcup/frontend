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
  gameweek: number;
  gameweekDate: string;
  freeTransfers: number;
  cost: number;
  budget: number;
  starters: FantasyPlayer[];
  bench: FantasyPlayer[];
};
