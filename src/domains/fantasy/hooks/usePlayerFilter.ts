// ─── usePlayerFilter Hook ─────────────────────────────────────────────
// Shared filter/sort logic for player selection lists.
// Used by PlayerList (mobile drawer) and PlayerCardGrid (desktop sidebar).
//
// Handles: text search, position-filter pills, sort field + direction toggle.
//
// POSITION FILTER BEHAVIOUR:
// - initialPositionFilter: sets the default pill on mount (e.g. "DEF" when
//   the user clicks an empty DEF slot)
// - lockedPosition: overrides the filter entirely and disables the pills
//   (used during replacement so the user can only pick the correct position)
// - syncPositionFilter: when true, a useEffect keeps the filter in sync with
//   initialPositionFilter changes — needed for PlayerCardGrid which stays
//   mounted as a sidebar, but NOT for PlayerList which remounts per drawer open

import { useState, useMemo, useEffect } from 'react';
import type { FantasyAvailablePlayer, PlayerPosition } from '../contracts';

export type SortField = 'price' | 'points' | 'name';

/** Position pill options rendered in both mobile and desktop player lists */
export const positionFilters: { label: string; value: PlayerPosition | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'GK', value: 'GK' },
  { label: 'DEF', value: 'DEF' },
  { label: 'MID', value: 'MID' },
  { label: 'FWD', value: 'FWD' },
];

/** Tailwind classes for the position badge in each player row/card */
export const positionColors: Record<PlayerPosition, string> = {
  GK: 'bg-amber-500/20 text-amber-300',
  DEF: 'bg-emerald-500/20 text-emerald-300',
  MID: 'bg-sky-500/20 text-sky-300',
  FWD: 'bg-red-500/20 text-red-300',
};

type UsePlayerFilterParams = {
  players: FantasyAvailablePlayer[];
  initialPositionFilter?: PlayerPosition | 'ALL';
  lockedPosition?: PlayerPosition;
  /** When true, syncs positionFilter state when initialPositionFilter changes (needed for components that stay mounted) */
  syncPositionFilter?: boolean;
};

export const usePlayerFilter = ({
  players,
  initialPositionFilter = 'ALL',
  lockedPosition,
  syncPositionFilter = false,
}: UsePlayerFilterParams) => {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<PlayerPosition | 'ALL'>(initialPositionFilter);
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortAsc, setSortAsc] = useState(false);

  // Sync filter state when the parent changes initialPositionFilter externally.
  // Only active for components that stay mounted (PlayerCardGrid sidebar).
  useEffect(() => {
    if (syncPositionFilter) {
      setPositionFilter(initialPositionFilter);
    }
  }, [syncPositionFilter, initialPositionFilter]);

  // lockedPosition takes priority — prevents the user from switching away
  // from the required position during a transfer replacement.
  const effectiveFilter = lockedPosition ?? positionFilter;

  // Pipeline: full list → text search → position filter → sort
  const filteredPlayers = useMemo(() => {
    let result = [...players];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.teamShort.toLowerCase().includes(q));
    }

    if (effectiveFilter !== 'ALL') {
      result = result.filter((p) => p.position === effectiveFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'price') cmp = a.price - b.price;
      else if (sortField === 'points') cmp = a.points - b.points;
      else cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [players, search, effectiveFilter, sortField, sortAsc]);

  // Clicking the active sort field flips direction; clicking a new field resets to descending.
  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return {
    filteredPlayers,
    search,
    setSearch,
    effectiveFilter,
    setPositionFilter,
    sortField,
    sortAsc,
    handleSortToggle,
  };
};
