'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Search, ChevronDown } from 'lucide-react';
import type { FantasyAvailablePlayer, PlayerPosition } from '../contracts';

type PlayerListSidebarProps = {
  players: FantasyAvailablePlayer[];
};

const positionFilters: { label: string; value: PlayerPosition | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'GK', value: 'GK' },
  { label: 'DEF', value: 'DEF' },
  { label: 'MID', value: 'MID' },
  { label: 'FWD', value: 'FWD' },
];

type SortField = 'price' | 'points' | 'name';

const positionColors: Record<PlayerPosition, string> = {
  GK: 'bg-amber-500/20 text-amber-300',
  DEF: 'bg-emerald-500/20 text-emerald-300',
  MID: 'bg-sky-500/20 text-sky-300',
  FWD: 'bg-red-500/20 text-red-300',
};

const PlayerListSidebar = ({ players }: PlayerListSidebarProps) => {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<PlayerPosition | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('price');
  const [sortAsc, setSortAsc] = useState(false);

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
    <div className="flex flex-col h-full bg-[#0a0014] border-r border-white/10">
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
            className={cn(
              'px-4 py-2 grid grid-cols-[1fr_48px_48px] gap-2 items-center border-b border-white/5 transition-colors',
              player.selected ? 'bg-cyan-400/10' : 'hover:bg-white/5',
            )}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className={cn('shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold', positionColors[player.position])}
              >
                {player.position}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-white truncate">{player.name}</p>
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

export default PlayerListSidebar;
