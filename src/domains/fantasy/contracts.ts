// ─── Fantasy Domain Contracts ──────────────────────────────────────────
// All TypeScript types for the fantasy gamemode.
// These define the data shapes flowing between the API/mock layer and the UI.
// TODO: When connecting to real API, these should match (or be mapped from) GraphQL types.

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export type JerseyStyle = {
  color: string;
  textColor: string;
  label: string; // The number displayed on the jersey
};

/** Controls what the bottom bar of a PlayerCard shows: total points or next fixture */
export type PlayerCardDisplayMode = 'points' | 'nextMatch';

/** A single past match result – used in the "Form" section of PlayerDetailDrawer */
export type MatchResult = {
  opponent: string; // Short code, e.g. "DOR"
  points: number;
};

/** An upcoming fixture – used in the "Fixtures" section of PlayerDetailDrawer */
export type UpcomingFixture = {
  opponent: string;
  /** Difficulty 1-5, higher = harder */
  difficulty: number;
  /** Optional date/time string, e.g. "Sat 14 Dec 15:00" */
  dateTime?: string;
};

/**
 * A player on the user's team (starter or bench).
 * Used throughout the pitch, drag-and-drop, and player detail drawer.
 * TODO: Many optional fields (form, fixtures, ptsPerMatch, etc.) are only needed
 * by PlayerDetailDrawer. Consider splitting into a "summary" and "detail" type
 * to reduce payload when fetching from the API.
 */
export type FantasyPlayer = {
  id: string;
  name: string;
  position: PlayerPosition;
  points: number;
  jersey: JerseyStyle;
  isCaptain?: boolean;
  /** Next fixture text, e.g. "MCI (H)" – shown on PlayerCard in nextMatch display mode */
  nextMatch?: string;
  /** Player price in millions, e.g. 4.9 – shown in Transfers tab */
  price?: number;
  /** Team short code, e.g. "MCI" */
  teamShort?: string;
  /** Points per match average – shown in PlayerDetailDrawer stats */
  ptsPerMatch?: number;
  /** Percentage of managers who selected this player – shown in PlayerDetailDrawer */
  selectedBy?: number;
  /** Last N match results (form) – shown in PlayerDetailDrawer */
  form?: MatchResult[];
  /** Upcoming fixtures – shown in PlayerDetailDrawer */
  fixtures?: UpcomingFixture[];
  /** Player image URL – shown in PlayerDetailDrawer avatar */
  imageUrl?: string;
};

/**
 * A player available for transfer – lighter type used in PlayerList (mobile)
 * and PlayerCardGrid (desktop) for the player selection UI.
 * TODO: This is a subset of FantasyPlayer. Consider whether the API should
 * return this as a separate endpoint or part of a unified player query.
 */
export type FantasyAvailablePlayer = {
  id: string;
  name: string;
  teamShort: string;
  position: PlayerPosition;
  price: number;
  points: number;
};

/** A row in the standings/leaderboard table */
export type FantasyStandingsEntry = {
  rank: number;
  managerName: string;
  teamName: string;
  gameweekPoints: number;
  totalPoints: number;
  isCurrentUser?: boolean;
};

/**
 * The full team data passed from the data layer (FantasyView) to the UI (FantasyViewUi).
 * Contains both header/meta info and the actual player arrays.
 * TODO: starters and bench are managed as local state in useFantasyTeam after initial load.
 * Consider whether mutations (captain, swap, transfer) should be optimistic or server-confirmed.
 */
export type FantasyTeamData = {
  teamName?: string;
  gameweek: number;
  gameweekDate: string;

  // Header stats shown on the "Points" tab (optional – UI falls back to 0)
  latestPoints?: number;
  averagePoints?: number;
  highestPoints?: number;
  gwRank?: number; // TODO: Currently unused in the UI – wire up or remove
  transfers?: number; // TODO: Currently unused in the UI – wire up or remove

  freeTransfers: number; // Shown on Pick Team / Transfers tab header
  cost: number; // TODO: Currently unused in the UI – wire up or remove
  budget: number; // Shown on Pick Team / Transfers tab header
  starters: FantasyPlayer[]; // Initial starting XI (passed to useFantasyTeam)
  bench: FantasyPlayer[]; // Initial bench (passed to useFantasyTeam)
};
