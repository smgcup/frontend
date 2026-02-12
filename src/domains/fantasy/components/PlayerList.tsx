'use client';

import { cn } from '@/lib/utils';
import { Search, ChevronDown } from 'lucide-react';
import type { FantasyAvailablePlayer } from '../contracts';
import {
  usePlayerFilter,
  positionFilters,
  positionCodeColors,
  type FantasyPositionCode,
} from '../hooks/usePlayerFilter';
import { toPositionCode } from '../utils/positionUtils';

type PlayerListProps = {
  players: FantasyAvailablePlayer[];
  /** Pre-select a position filter when opened from an empty slot */
  initialPositionFilter?: FantasyPositionCode | 'ALL';
  /** Lock the position filter to a specific position (used during transfers) */
  lockedPosition?: FantasyPositionCode;
  /** Called when a player row is clicked */
  onPlayerSelect?: (player: FantasyAvailablePlayer) => void;
};

const PlayerList = ({ players, initialPositionFilter = 'ALL', lockedPosition, onPlayerSelect }: PlayerListProps) => {
  const {
    filteredPlayers,
    search,
    setSearch,
    effectiveFilter,
    setPositionFilter,
    sortField,
    sortAsc,
    handleSortToggle,
  } = usePlayerFilter({ players, initialPositionFilter, lockedPosition });

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#1a0028]">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-base font-bold text-white tracking-tight">Player List</h2>
        <p className="text-xs text-white/50 mt-0.5">{filteredPlayers.length} players</p>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            placeholder="Search players..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 transition-colors"
          />
        </div>
      </div>

      {/* Position filter pills */}
      <div className="px-4 pb-3 flex gap-1.5">
        {positionFilters.map((f) => {
          const isActive = effectiveFilter === f.value;
          const isDisabled = !!lockedPosition && f.value !== lockedPosition;
          return (
            <button
              key={f.value}
              type="button"
              disabled={isDisabled}
              onClick={() => !lockedPosition && setPositionFilter(f.value)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all',
                isActive
                  ? 'bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/30'
                  : isDisabled
                    ? 'bg-white/3 text-white/20 cursor-not-allowed'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70',
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Table header */}
      <div className="px-4 py-2 grid grid-cols-[1fr_48px_48px] gap-2 border-t border-b border-white/8 bg-white/3">
        <button
          type="button"
          onClick={() => handleSortToggle('name')}
          className="flex items-center gap-1 text-[10px] font-semibold text-white/60 hover:text-white/80 transition-colors"
        >
          Player
          {sortField === 'name' && (
            <ChevronDown className={cn('w-3 h-3 transition-transform', sortAsc && 'rotate-180')} />
          )}
        </button>
        <button
          type="button"
          onClick={() => handleSortToggle('price')}
          className="flex items-center justify-end gap-0.5 text-[10px] font-semibold text-white/60 hover:text-white/80 transition-colors"
        >
          Price
          {sortField === 'price' && (
            <ChevronDown className={cn('w-3 h-3 transition-transform', sortAsc && 'rotate-180')} />
          )}
        </button>
        <button
          type="button"
          onClick={() => handleSortToggle('points')}
          className="flex items-center justify-end gap-0.5 text-[10px] font-semibold text-white/60 hover:text-white/80 transition-colors"
        >
          Pts
          {sortField === 'points' && (
            <ChevronDown className={cn('w-3 h-3 transition-transform', sortAsc && 'rotate-180')} />
          )}
        </button>
      </div>

      {/* Player rows */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            onClick={() => onPlayerSelect?.(player)}
            className={cn(
              'px-4 py-2 grid grid-cols-[1fr_48px_48px] gap-2 items-center border-b border-white/5 transition-colors hover:bg-white/5',
              onPlayerSelect && 'cursor-pointer',
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn(
                  'shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold',
                  positionCodeColors[toPositionCode(player.position)],
                )}
              >
                {toPositionCode(player.position)}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{player.displayName}</p>
                <p className="text-[9px] text-white/40">{player.teamShort}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-cyan-300">
                {'£'}
                {player.price.toFixed(1)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-white/80">{player.points}</span>
            </div>
          </div>
        ))}

        {filteredPlayers.length === 0 && (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-white/40">No players found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerList;
