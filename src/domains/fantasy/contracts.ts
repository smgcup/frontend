export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type JerseyStyle = {
  color: string;
  textColor: string;
  label: string;
};

/** What the bottom bar of a PlayerCard should show */
export type PlayerCardDisplayMode = 'points' | 'nextMatch';

export type FantasyPlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  points: number;
  jersey: JerseyStyle;
  isCaptain?: boolean;
  /** Next fixture text, e.g. "MCI (H)" */
  nextMatch?: string;
  /** Player price in millions, e.g. 4.9 */
  price?: number;
};

/** A player entry for the sidebar list */
export type FantasyAvailablePlayer = {
  id: string;
  name: string;
  teamShort: string;
  position: PlayerPosition;
  price: number;
  points: number;
  selected?: boolean;
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
