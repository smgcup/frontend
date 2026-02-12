'use client';

import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatchResult } from '../contracts';

type BreakdownContentProps = {
  match: MatchResult;
  playerName: string;
  onClose: () => void;
};

const BreakdownContent = ({ match, playerName, onClose }: BreakdownContentProps) => {
  const hasBreakdown = match.breakdown && match.breakdown.length > 0;

  return (
    <>
      {/* Header: back button, opponent, player name, total points */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close breakdown"
        >
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </button>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm leading-tight">vs {match.opponent}</h3>
          <p className="text-[10px] text-white/40 mt-0.5">{playerName}</p>
        </div>

        <div
          className={cn(
            'text-xs font-bold rounded-lg px-2.5 py-1',
            match.points >= 8
              ? 'bg-emerald-500/20 text-emerald-300'
              : match.points >= 4
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-red-500/20 text-red-300',
          )}
        >
          {match.points} pts
        </div>
      </div>

      {/* Breakdown rows */}
      {hasBreakdown ? (
        <div className="rounded-xl bg-white/5 border border-white/10 divide-y divide-white/5">
          {match.breakdown!.map((entry, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5">
              <span className="text-xs text-white/70">{entry.label}</span>
              <span
                className={cn(
                  'text-xs font-bold tabular-nums',
                  entry.value > 0 ? 'text-emerald-400' : entry.value < 0 ? 'text-red-400' : 'text-white/40',
                )}
              >
                {entry.value > 0 ? '+' : ''}
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/30 text-center py-6">No breakdown available</p>
      )}
    </>
  );
};

export default BreakdownContent;
