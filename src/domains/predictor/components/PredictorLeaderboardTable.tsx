'use client';

import { Target, CircleHelp } from 'lucide-react';
import PositionBadge from '@/components/PositionBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { predictorTheme } from '@/lib/gamemodeThemes';
import type { LeaderboardEntry } from '../contracts';
import { getUserDisplayName } from '../utils/getUserDisplayName';

const STATS = [
  { key: 'pts', short: 'Pts', full: 'Total Points' },
  { key: 'exact', short: 'Exact', full: 'Exact Matches' },
  { key: 'outcomes', short: 'Outcomes', full: 'Correct Outcomes' },
  { key: 'preds', short: 'Preds', full: 'Total Predictions' },
  { key: 'acc', short: 'Acc%', full: 'Accuracy (correct outcomes %)' },
] as const;

function StatHeader({ short, full }: { short: string; full: string }) {
  return (
    <th className="px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
      <span className="inline-flex items-center justify-center gap-1">
        {short}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className={cn('h-5 w-5 rounded-full text-muted-foreground', predictorTheme.hover, predictorTheme.hoverText)}
              aria-label={`Show full name for ${short}`}
            >
              <CircleHelp className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-max px-3 py-2">
            <DropdownMenuLabel className="text-sm font-normal text-foreground">{full}</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </span>
    </th>
  );
}

type PredictorLeaderboardTableProps = {
  leaderboard: LeaderboardEntry[];
};

const PredictorLeaderboardTable = ({ leaderboard }: PredictorLeaderboardTableProps) => {
  return (
    <div className={cn('rounded-lg border bg-card p-6 shadow-sm ring-1', predictorTheme.ring)}>
      <div className="mb-6 flex items-center gap-2">
        <Target className={cn('h-6 w-6', predictorTheme.iconAccent)} />
        <h3 className="text-2xl font-bold">Leaderboard</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn('border-b', predictorTheme.headerBorder)}>
              <th className="px-3 py-3 text-center text-sm font-semibold text-muted-foreground">Pos</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Player</th>
              {STATS.map(({ key, short, full }) => (
                <StatHeader key={key} short={short} full={full} />
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => {
              const position = index + 1;
              const isTop3 = position <= 3;

              return (
                <tr
                  key={player.id}
                  className={cn('border-b transition-colors', predictorTheme.rowHover, isTop3 && predictorTheme.rowHighlight)}
                >
                  <td className="px-3 py-4 text-center">
                    <PositionBadge position={position} showIcon={isTop3} />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{getUserDisplayName(player.user)}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className={cn('font-bold', predictorTheme.textDark)}>{player.totalPoints}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.exactMatchesCount}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.correctOutcomesCount}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.totalPredictionsCount}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.accuracy}%</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PredictorLeaderboardTable;
