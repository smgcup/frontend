export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type JerseyStyle = {
  color: string;
  textColor: string;
  label: string;
};

/** What the bottom bar of a PlayerCard should show */
export type PlayerCardDisplayMode = 'points' | 'nextMatch';

export type MatchResult = {
  opponent: string;
  points: number;
};

export type UpcomingFixture = {
  opponent: string;
  /** Difficulty 1-5, higher = harder */
  difficulty: number;
  /** Optional date/time string, e.g. "Sat 14 Dec 15:00" */
  dateTime?: string;
};

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
  /** Team short code, e.g. "MCI" */
  teamShort?: string;
  /** Points per match average */
  ptsPerMatch?: number;
  /** Percentage of managers who selected this player */
  selectedBy?: number;
  /** Last N match results (form) */
  form?: MatchResult[];
  /** Upcoming fixtures */
  fixtures?: UpcomingFixture[];
  /** Player image URL */
  imageUrl?: string;
};

/** A player entry for the sidebar list */
export type FantasyAvailablePlayer = {
  id: string;
  name: string;
  teamShort: string;
  position: PlayerPosition;
  price: number;
  points: number;
};

export type FantasyStandingsEntry = {
  rank: number;
  managerName: string;
  teamName: string;
  gameweekPoints: number;
  totalPoints: number;
  isCurrentUser?: boolean;
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
