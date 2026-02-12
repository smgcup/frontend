import { PlayerPosition } from '@/graphql';

/** Short-code used throughout the fantasy UI */
export type FantasyPositionCode = 'GK' | 'DEF' | 'MID' | 'FWD';

/** Ordered list for rendering filter pills */
export const FANTASY_POSITION_CODES: FantasyPositionCode[] = ['GK', 'DEF', 'MID', 'FWD'];

const positionToCode: Record<PlayerPosition, FantasyPositionCode> = {
  [PlayerPosition.Goalkeeper]: 'GK',
  [PlayerPosition.Defender]: 'DEF',
  [PlayerPosition.Midfielder]: 'MID',
  [PlayerPosition.Forward]: 'FWD',
};

const positionToLabel: Record<PlayerPosition, string> = {
  [PlayerPosition.Goalkeeper]: 'Goalkeeper',
  [PlayerPosition.Defender]: 'Defender',
  [PlayerPosition.Midfielder]: 'Midfielder',
  [PlayerPosition.Forward]: 'Forward',
};

/** Convert a GraphQL PlayerPosition enum value to its short code (e.g. 'GK') */
export function toPositionCode(position: PlayerPosition): FantasyPositionCode {
  return positionToCode[position];
}

/** Convert a GraphQL PlayerPosition enum value to its full label (e.g. 'Goalkeeper') */
export function toPositionLabel(position: PlayerPosition): string {
  return positionToLabel[position];
}

/** Full label for each position code (e.g. 'GK' → 'Goalkeeper') */
export const positionCodeToLabel: Record<FantasyPositionCode, string> = {
  GK: 'Goalkeeper',
  DEF: 'Defender',
  MID: 'Midfielder',
  FWD: 'Forward',
};

/** Tailwind classes for the position badge in player rows/cards */
export const positionCodeColors: Record<FantasyPositionCode, string> = {
  GK: 'bg-amber-500/20 text-amber-300',
  DEF: 'bg-emerald-500/20 text-emerald-300',
  MID: 'bg-sky-500/20 text-sky-300',
  FWD: 'bg-red-500/20 text-red-300',
};
