// ─── MatchBreakdownDrawer ──────────────────────────────────────────────
// A bottom-sheet drawer showing a detailed points breakdown for a match.
// Used on mobile only — desktop uses a floating panel (see PlayerDetailDrawer).
'use client';

import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import type { MatchResult } from '../contracts';
import BreakdownContent from './BreakdownContent';

type MatchBreakdownDrawerProps = {
  match: MatchResult | null;
  playerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MatchBreakdownDrawer = ({ match, playerName, open, onOpenChange }: MatchBreakdownDrawerProps) => {
  if (!match) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="bottom" className="border-t border-white/10 bg-linear-to-b from-[#1a0028] to-[#07000f] pb-8">
        <DrawerTitle className="sr-only">Points Breakdown vs {match.opponent}</DrawerTitle>
        <DrawerDescription className="sr-only">Detailed scoring breakdown for {playerName}</DrawerDescription>

        <div className="px-5 pt-1 pb-6">
          <BreakdownContent match={match} playerName={playerName} onClose={() => onOpenChange(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MatchBreakdownDrawer;
