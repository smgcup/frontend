// ─── Fantasy Domain Contracts ──────────────────────────────────────────
// All TypeScript types for the fantasy gamemode.
// FantasyPlayer and FantasyAvailablePlayer extend the global Player type
// and use the GraphQL PlayerPosition enum for type-safe position handling.

import type { Player } from '@/domains/player/contracts';
import type { PlayerPosition } from '@/graphql';

export type JerseyStyle = {
  color: string;
  textColor: string;
  label: string; // The number displayed on the jersey
};

/** A single scoring line inside a match breakdown (e.g. "Goals scored: +8") */
export type PointsBreakdownEntry = {
  label: string; // Human-readable label, e.g. "Goals Scored"
  value: number; // Signed points contribution (positive or negative)
};

/** A single past match result – used in the "Form" section of PlayerDetailDrawer */
export type MatchResult = {
  opponent: string; // Short code, e.g. "DOR"
  points: number;
  /** Optional breakdown of how the total points were earned */
  breakdown?: PointsBreakdownEntry[];
};

/** An upcoming fixture – used in the "Fixtures" section of PlayerDetailDrawer */
export type UpcomingFixture = {
  opponent: string;
  /** Optional date/time string, e.g. "Sat 14 Dec 15:00" */
  dateTime?: string;
};

/**
 * A player on the user's team (starter or bench).
 * Used throughout the pitch, drag-and-drop, and player detail drawer.
 * Extends the global Player type with fantasy-specific fields.
 */
export type FantasyPlayer = Omit<Player, 'position'> & {
  position: PlayerPosition; // required (not optional like in Player)
  displayName: string;
  /** Total points – undefined means the player hasn't played yet */
  points?: number;
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
  // imageUrl inherited from Player — not redeclared
};

/**
 * A player available for transfer – lighter type used in PlayerList (mobile)
 * and PlayerCardGrid (desktop) for the player selection UI.
 */
export type FantasyAvailablePlayer = Omit<Player, 'position'> & {
  position: PlayerPosition;
  displayName: string;
  teamShort: string;
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

export type FantasyHomeData = {
  teamName?: string;
  managerName?: string;
  currentGameweek: number;
  currentGameweekPoints?: number;
  averagePoints?: number;
  highestPoints?: number;
  nextGameweek: number;
  nextDeadline: Date;
};

/**
 * The full team data passed from the data layer (FantasyView) to the UI (FantasyViewUi).
 * Contains both header/meta info and the actual player arrays.
 */
export type FantasyTeamData = {
  teamName?: string;
  gameweek: number;

  // Header stats shown on the "Points" tab (optional – UI falls back to 0)
  latestPoints?: number;
  averagePoints?: number;
  highestPoints?: number;

  freeTransfers: number; // Shown on Pick Team / Transfers tab header
  budget: number; // Shown on Pick Team / Transfers tab header
  transferCost: number; // Points cost for extra transfers beyond free allowance
  starters: FantasyPlayer[]; // Initial starting XI (passed to useFantasyTeam)
  bench: FantasyPlayer[]; // Initial bench (passed to useFantasyTeam)
  /** Player IDs that start as empty slots (shown as EmptySlotCards on the pitch) */
  initialRemovedPlayerIds?: Set<string>;
};
