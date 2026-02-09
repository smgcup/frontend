import type { FantasyPlayer } from '../contracts';

/** A formation is [DEF count, MID count, FWD count]. GK is always 1. */
export type Formation = [number, number, number];

/** The three valid formations: DEF-MID-FWD */
export const VALID_FORMATIONS: Formation[] = [
  [3, 1, 1],
  [2, 2, 1],
  [2, 1, 2],
];

export function getFormation(starters: FantasyPlayer[]): Formation {
  let def = 0;
  let mid = 0;
  let fwd = 0;
  for (const p of starters) {
    if (p.position === 'DEF') def++;
    else if (p.position === 'MID') mid++;
    else if (p.position === 'FWD') fwd++;
  }
  return [def, mid, fwd];
}

export function isValidFormation(formation: Formation): boolean {
  return VALID_FORMATIONS.some(
    ([d, m, f]) => formation[0] === d && formation[1] === m && formation[2] === f,
  );
}

export function isSwapValid(
  playerA: FantasyPlayer,
  playerB: FantasyPlayer,
  starters: FantasyPlayer[],
  aIsStarter: boolean,
  bIsStarter: boolean,
): boolean {
  // Both on bench: bench order is flexible, always allowed
  if (!aIsStarter && !bIsStarter) return true;

  // Both starters: only same-position swaps are meaningful
  // (different positions render in separate pitch rows, so swapping has no visible effect)
  if (aIsStarter && bIsStarter) return playerA.position === playerB.position;

  // One starter, one bench
  const starter = aIsStarter ? playerA : playerB;
  const bencher = aIsStarter ? playerB : playerA;

  // GK can only swap with GK
  if (starter.position === 'GK' || bencher.position === 'GK') {
    return starter.position === 'GK' && bencher.position === 'GK';
  }

  // Same position: formation never changes
  if (starter.position === bencher.position) return true;

  // Different outfield positions: simulate and check
  const hypothetical = starters.map((p) => (p.id === starter.id ? bencher : p));
  return isValidFormation(getFormation(hypothetical));
}

export function getValidSwapTargets(
  draggedPlayer: FantasyPlayer,
  draggedIsStarter: boolean,
  starters: FantasyPlayer[],
  bench: FantasyPlayer[],
): Set<string> {
  const validIds = new Set<string>();

  for (const target of starters) {
    if (target.id === draggedPlayer.id) continue;
    if (isSwapValid(draggedPlayer, target, starters, draggedIsStarter, true)) {
      validIds.add(target.id);
    }
  }

  for (const target of bench) {
    if (target.id === draggedPlayer.id) continue;
    if (isSwapValid(draggedPlayer, target, starters, draggedIsStarter, false)) {
      validIds.add(target.id);
    }
  }

  return validIds;
}
