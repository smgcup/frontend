'use client';

import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, ChevronDown } from 'lucide-react';
import type { FantasyAvailablePlayer, PlayerPosition } from '../contracts';

type PlayerCardGridProps = {
  players: FantasyAvailablePlayer[];
  /** Pre-select a position filter when opened from an empty slot */
  initialPositionFilter?: PlayerPosition | 'ALL';
  /** Called when a player card is clicked */
  onPlayerSelect?: (player: FantasyAvailablePlayer) => void;
};

const positionFilters: { label: string; value: PlayerPosition | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'GK', value: 'GK' },
  { label: 'DEF', value: 'DEF' },
  { label: 'MID', value: 'MID' },
  { label: 'FWD', value: 'FWD' },
];

type SortField = 'price' | 'points' | 'name';

const sortOptions: { label: string; value: SortField }[] = [
  { label: 'Price', value: 'price' },
  { label: 'Points', value: 'points' },
  { label: 'Name', value: 'name' },
];

const positionColors: Record<PlayerPosition, string> = {
  GK: 'bg-amber-500/20 text-amber-300',
  DEF: 'bg-emerald-500/20 text-emerald-300',
  MID: 'bg-sky-500/20 text-sky-300',
  FWD: 'bg-red-500/20 text-red-300',
};

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

const PlayerCardGrid = ({ players, initialPositionFilter = 'ALL', onPlayerSelect }: PlayerCardGridProps) => {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<PlayerPosition | 'ALL'>(initialPositionFilter);
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    setPositionFilter(initialPositionFilter);
  }, [initialPositionFilter]);

  const filteredPlayers = useMemo(() => {
    let result = [...players];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.teamShort.toLowerCase().includes(q));
    }

    if (positionFilter !== 'ALL') {
      result = result.filter((p) => p.position === positionFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'price') cmp = a.price - b.price;
      else if (sortField === 'points') cmp = a.points - b.points;
      else cmp = a.name.localeCompare(b.name);
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [players, search, positionFilter, sortField, sortAsc]);

  const handleSortToggle = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

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
          {positionFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setPositionFilter(f.value)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all',
                positionFilter === f.value
                  ? 'bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/30'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70',
              )}
            >
              {f.label}
            </button>
          ))}
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
