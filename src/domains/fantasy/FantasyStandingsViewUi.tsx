// ─── Fantasy Standings UI ──────────────────────────────────────────────
// The leaderboard page UI. Two tabs:
// - "Gameweeks": shows rankings for a specific gameweek with prev/next navigation
// - "Overall": shows cumulative standings across all gameweeks
// Both use the same StandingsTable component. Current user's row is highlighted.
'use client';

import { useState } from 'react';
import { Trophy, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import FantasyTabs, { type FantasyTabItem } from './components/FantasyTabs';
import type { FantasyStandingsEntry } from './contracts';

type StandingsTab = 'gameweeks' | 'overall';

const standingsTabs: FantasyTabItem<StandingsTab>[] = [
  { id: 'gameweeks', label: 'Gameweeks', icon: Calendar },
  { id: 'overall', label: 'Overall', icon: Trophy },
];

type FantasyStandingsViewUiProps = {
  gameweekStandings: Record<number, FantasyStandingsEntry[]>;
  overallStandings: FantasyStandingsEntry[];
  totalGameweeks: number;
  currentGameweek: number;
};

const StandingsTable = ({ entries }: { entries: FantasyStandingsEntry[] }) => {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/3">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_72px_72px] sm:grid-cols-[48px_1fr_88px_88px] items-center gap-0 px-3 sm:px-4 py-2.5 bg-white/6 text-[11px] sm:text-xs font-semibold text-white/40 uppercase tracking-wider">
        <div className="text-center">#</div>
        <div>Manager</div>
        <div className="text-center">GW</div>
        <div className="text-center">Total</div>
      </div>

      {/* Rows */}
      {entries.map((entry) => (
        <div
          key={`${entry.rank}-${entry.managerName}`}
          className={cn(
            'grid grid-cols-[40px_1fr_72px_72px] sm:grid-cols-[48px_1fr_88px_88px] items-center gap-0 px-3 sm:px-4 py-3 border-t border-white/6 transition-colors',
            entry.isCurrentUser ? 'bg-fuchsia-500/10 border-l-2 border-l-fuchsia-400' : 'hover:bg-white/3',
          )}
        >
          {/* Rank */}
          <div className="text-center">
            {entry.rank <= 3 ? (
              <span
                className={cn(
                  'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                  entry.rank === 1 && 'bg-yellow-500/20 text-yellow-400',
                  entry.rank === 2 && 'bg-gray-300/20 text-gray-300',
                  entry.rank === 3 && 'bg-amber-700/20 text-amber-600',
                )}
              >
                {entry.rank}
              </span>
            ) : (
              <span className="text-sm text-white/50">{entry.rank}</span>
            )}
          </div>

          {/* Manager + Team */}
          <div className="min-w-0">
            <div
              className={cn('text-sm font-semibold truncate', entry.isCurrentUser ? 'text-fuchsia-300' : 'text-white')}
            >
              {entry.managerName}
              {entry.isCurrentUser && (
                <span className="ml-1.5 text-[10px] font-bold text-fuchsia-400 bg-fuchsia-400/15 px-1.5 py-0.5 rounded-full">
                  YOU
                </span>
              )}
            </div>
            <div className="text-xs text-white/40 truncate">{entry.teamName}</div>
          </div>

          {/* GW Points */}
          <div className="text-center text-sm font-semibold text-white/70">{entry.gameweekPoints}</div>

          {/* Total Points */}
          <div className={cn('text-center text-sm font-bold', entry.isCurrentUser ? 'text-fuchsia-300' : 'text-white')}>
            {entry.totalPoints}
          </div>
        </div>
      ))}
    </div>
  );
};

const FantasyStandingsViewUi = ({
  gameweekStandings,
  overallStandings,
  totalGameweeks,
  currentGameweek,
}: FantasyStandingsViewUiProps) => {
  const [activeTab, setActiveTab] = useState<StandingsTab>('gameweeks');
  const [gameweek, setGameweek] = useState(currentGameweek);

  const gwEntries = gameweekStandings[gameweek] ?? [];

  return (
    <div className="min-h-screen bg-[#07000f]">
      <div className="mx-auto w-full max-w-2xl px-2 pt-0 pb-24 lg:pt-4">
        <FantasyTabs<StandingsTab> tabs={standingsTabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'gameweeks' && (
          <div>
            {/* Gameweek navigation */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <button
                type="button"
                aria-label="Previous gameweek"
                disabled={gameweek <= 1}
                onClick={() => setGameweek((g) => g - 1)}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                  gameweek <= 1
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white',
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-white font-extrabold text-lg tracking-tight">Gameweek {gameweek}</div>
              <button
                type="button"
                aria-label="Next gameweek"
                disabled={gameweek >= totalGameweeks}
                onClick={() => setGameweek((g) => g + 1)}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                  gameweek >= totalGameweeks
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white',
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <StandingsTable entries={gwEntries} />
          </div>
        )}

        {activeTab === 'overall' && (
          <div>
            <div className="text-center mb-5">
              <div className="text-white font-extrabold text-lg tracking-tight">Overall Standings</div>
            </div>
            <StandingsTable entries={overallStandings} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FantasyStandingsViewUi;
