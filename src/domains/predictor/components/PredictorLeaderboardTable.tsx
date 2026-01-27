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
import type { LeaderboardEntry } from '../contracts';
import { getDisplayName } from '../utils/getDisplayName';

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
              className="h-5 w-5 rounded-full text-muted-foreground hover:text-orange-600 hover:bg-orange-500/10 dark:hover:text-orange-400"
              aria-label={`Show full name for ${short}`}
            >
              <CircleHelp className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-max px-3 py-2">
            <DropdownMenuLabel className="text-sm font-normal text-foreground">
              {full}
            </DropdownMenuLabel>
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
    <div className="rounded-lg border bg-card p-6 shadow-sm ring-1 ring-orange-500/10">
      <div className="mb-6 flex items-center gap-2">
        <Target className="h-6 w-6 text-orange-500" />
        <h3 className="text-2xl font-bold">Leaderboard</h3>
      </div>
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-orange-500/20">
              <th className="px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
                Pos
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">
                Player
              </th>
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
                  className={cn(
                    'border-b transition-colors hover:bg-orange-500/5',
                    isTop3 && 'bg-orange-500/5',
                  )}
                >
                  <td className="px-3 py-4 text-center">
                    <PositionBadge position={position} />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{getDisplayName(player.user)}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-bold text-orange-600 dark:text-orange-400">
                      {player.totalPoints}
                    </p>
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
