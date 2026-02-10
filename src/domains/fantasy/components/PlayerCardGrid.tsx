// ─── PlayerCardGrid (Desktop) ──────────────────────────────────────────
// A card-grid layout for available players, shown as a sticky left sidebar on lg+ screens.
// Has the same filtering/sorting functionality as PlayerList (mobile) but rendered as cards.
//
// The grid reacts to position filter changes from FantasyViewUi:
// - initialPositionFilter syncs via useEffect when user clicks an EmptySlotCard
// - lockedPosition prevents the user from changing the filter during replacement
'use client';

import { cn } from '@/lib/utils';
import { Search, ChevronDown } from 'lucide-react';
import type { FantasyAvailablePlayer, PlayerPosition } from '../contracts';
import { usePlayerFilter, positionFilters, positionColors, type SortField } from '../hooks/usePlayerFilter';

type PlayerCardGridProps = {
  players: FantasyAvailablePlayer[];
  /** Pre-select a position filter when opened from an empty slot */
  initialPositionFilter?: PlayerPosition | 'ALL';
  /** Lock the position filter to a specific position (used during transfers) */
  lockedPosition?: PlayerPosition;
  /** Called when a player card is clicked */
  onPlayerSelect?: (player: FantasyAvailablePlayer) => void;
};

const sortOptions: { label: string; value: SortField }[] = [
  { label: 'Price', value: 'price' },
  { label: 'Points', value: 'points' },
  { label: 'Name', value: 'name' },
];

const PlayerCardGridItem = ({
  player,
  onClick,
  hasClickHandler,
}: {
  player: FantasyAvailablePlayer;
  onClick: () => void;
  hasClickHandler: boolean;
}) => (
  <div
    onClick={onClick}
    className={cn(
      'relative rounded-xl p-3 transition-all',
      'bg-white/5 border border-white/10 backdrop-blur-sm',
      'hover:bg-white/8 hover:border-white/20 hover:shadow-[0_0_15px_rgba(139,92,246,0.1)]',
      hasClickHandler && 'cursor-pointer',
    )}
  >
    <span className={cn('inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mb-1.5', positionColors[player.position])}>
      {player.position}
    </span>
    <p className="text-[12px] font-semibold text-white truncate leading-tight">{player.name}</p>
    <p className="text-[10px] text-white/40 mt-0.5">{player.teamShort}</p>
    <div className="h-px bg-white/8 my-2" />
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-semibold text-cyan-300">
        {'£'}
        {player.price.toFixed(1)}
      </span>
      <span className="text-[11px] font-semibold text-fuchsia-300">{player.points} pts</span>
    </div>
  </div>
);

const PlayerCardGrid = ({ players, initialPositionFilter = 'ALL', lockedPosition, onPlayerSelect }: PlayerCardGridProps) => {
  const { filteredPlayers, search, setSearch, effectiveFilter, setPositionFilter, sortField, sortAsc, handleSortToggle } =
    usePlayerFilter({ players, initialPositionFilter, lockedPosition, syncPositionFilter: true });

  return (
    <div>
      {/* Header */}
      <div className="pb-3">
        <h2 className="text-base font-bold text-white tracking-tight">Player List</h2>
        <p className="text-xs text-white/50 mt-0.5">{filteredPlayers.length} players</p>
      </div>

      {/* Search */}
      <div className="pb-3">
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

      {/* Position filter pills + Sort pills */}
      <div className="pb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex gap-1.5">
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

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/40 font-medium">Sort:</span>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSortToggle(opt.value)}
              className={cn(
                'flex items-center gap-0.5 px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all',
                sortField === opt.value
                  ? 'bg-fuchsia-400/20 text-fuchsia-300 ring-1 ring-fuchsia-400/30'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70',
              )}
            >
              {opt.label}
              {sortField === opt.value && (
                <ChevronDown className={cn('w-3 h-3 transition-transform', sortAsc && 'rotate-180')} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-3 xl:grid-cols-4 gap-2.5">
          {filteredPlayers.map((player) => (
            <PlayerCardGridItem
              key={player.id}
              player={player}
              onClick={() => onPlayerSelect?.(player)}
              hasClickHandler={!!onPlayerSelect}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-xs text-white/40">No players found</p>
        </div>
      )}
    </div>
  );
};

export default PlayerCardGrid;
