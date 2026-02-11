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

import { useState, useMemo, useEffect, useRef, startTransition } from 'react';
import type { FantasyAvailablePlayer } from '../contracts';
import {
  type FantasyPositionCode,
  FANTASY_POSITION_CODES,
  toPositionCode,
  positionCodeColors,
} from '../utils/positionUtils';

export { positionCodeColors };
export type { FantasyPositionCode };

export type SortField = 'price' | 'points' | 'name';

/** Position pill options rendered in both mobile and desktop player lists */
export const positionFilters: { label: string; value: FantasyPositionCode | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  ...FANTASY_POSITION_CODES.map((code) => ({ label: code, value: code })),
];

type UsePlayerFilterParams = {
  players: FantasyAvailablePlayer[];
  initialPositionFilter?: FantasyPositionCode | 'ALL';
  lockedPosition?: FantasyPositionCode;
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
  const [positionFilter, setPositionFilter] = useState<FantasyPositionCode | 'ALL'>(initialPositionFilter);
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortAsc, setSortAsc] = useState(false);
  const prevInitialPositionFilterRef = useRef(initialPositionFilter);

  // Sync filter state when the parent changes initialPositionFilter externally.
  // Only active for components that stay mounted (PlayerCardGrid sidebar).
  useEffect(() => {
    if (syncPositionFilter && prevInitialPositionFilterRef.current !== initialPositionFilter) {
      prevInitialPositionFilterRef.current = initialPositionFilter;
      startTransition(() => {
        setPositionFilter(initialPositionFilter);
      });
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
      result = result.filter(
        (p) => p.displayName.toLowerCase().includes(q) || p.teamShort.toLowerCase().includes(q),
      );
    }

    if (effectiveFilter !== 'ALL') {
      result = result.filter((p) => toPositionCode(p.position) === effectiveFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'price') cmp = a.price - b.price;
      else if (sortField === 'points') cmp = a.points - b.points;
      else cmp = a.displayName.localeCompare(b.displayName);
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
