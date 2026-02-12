// ─── MatchBreakdownDrawer ──────────────────────────────────────────────
// A nested drawer that slides up from the bottom showing a detailed
// breakdown of how a player earned their points in a specific match.
//
// Opened by tapping a match row in the Form section of PlayerDetailDrawer.
// Uses the same Drawer primitive so it layers on top of the parent drawer.
'use client';

import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import type { MatchResult } from '../contracts';

type MatchBreakdownDrawerProps = {
  match: MatchResult | null;
  playerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MatchBreakdownDrawer = ({ match, playerName, open, onOpenChange }: MatchBreakdownDrawerProps) => {
  if (!match) return null;

  const hasBreakdown = match.breakdown && match.breakdown.length > 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side="bottom"
        className="border-t border-white/10 bg-linear-to-b from-[#1a0028] to-[#07000f] pb-safe pb-12"
      >
        <DrawerTitle className="sr-only">Points Breakdown vs {match.opponent}</DrawerTitle>
        <DrawerDescription className="sr-only">Detailed scoring breakdown for {playerName}</DrawerDescription>

        <div className="px-5 pt-1 pb-6">
          {/* Header with back button, opponent, and total */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close breakdown"
            >
              <ArrowLeft className="w-4 h-4 text-white/70" />
            </button>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base leading-tight">vs {match.opponent}</h3>
              <p className="text-xs text-white/40 mt-0.5">{playerName}</p>
            </div>

            {/* Total points badge */}
            <div
              className={cn(
                'text-sm font-bold rounded-lg px-3 py-1.5',
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

          {/* Breakdown list */}
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MatchBreakdownDrawer;
