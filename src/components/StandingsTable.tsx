'use client';

import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';
import PositionBadge from '@/components/PositionBadge';
import { Team } from '@/domains/team/contracts';
import { cn } from '@/lib/utils';

type StandingsTableProps = {
  teams: Team[];
  limit?: number;
  title?: string;
};

const TableHeader = ({ label, className }: { label: string; className?: string }) => {
  return (
    <th className={cn('px-3 py-3 text-center text-sm font-semibold text-muted-foreground', className)}>{label}</th>
  );
};

const StandingsTable = ({ teams, limit, title = 'Standings' }: StandingsTableProps) => {
  const router = useRouter();

  const handleRowClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  const getPositionColor = (position: number, totalTeams: number): 'default' | 'green' | 'red' => {
    // First 4 teams: green
    if (position <= 4) {
      return 'green';
    }
    // Last 4 teams: red
    if (position > totalTeams - 4) {
      return 'red';
    }
    return 'default';
  };

  const displayedTeams = limit ? teams.slice(0, limit) : teams;
  const totalTeams = teams.length;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <TableHeader label="Pos" />
              <TableHeader label="Team" className="text-left" />
              <TableHeader label="P" />
              <TableHeader label="W" />
              <TableHeader label="D" />
              <TableHeader label="L" />
              <TableHeader label="GF" />
              <TableHeader label="GA" />
              <TableHeader label="GD" />
              <TableHeader label="Pts" />
            </tr>
          </thead>
          <tbody>
            {displayedTeams.map((team, index) => {
              const position = index + 1;
              const positionColor = getPositionColor(position, totalTeams);

              // Add thicker border after top 4 (after position 4, index 3)
              const isAfterTop4 = index === 3;
              // Add thicker border before bottom 4 (on the row before the first of bottom 4)
              const isBeforeBottom4 = index === totalTeams - 4 - 1;

              const borderClass = isAfterTop4 || isBeforeBottom4 ? 'border-b-2 border-foreground/30' : 'border-b';

              return (
                <tr
                  key={team.id}
                  onClick={() => handleRowClick(team.id)}
                  className={`${borderClass} transition-colors hover:bg-muted/50 cursor-pointer`}
                >
                  <td className="px-3 py-4 text-center">
                    <PositionBadge position={position} color={positionColor} />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{team.name}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{team.stats?.points}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{team.stats?.wins}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{team.stats?.draws}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{team.stats?.losses}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{team.stats?.goals}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{team.stats?.goalsConceded}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">
                      {team.stats?.goals ? team.stats?.goals - team.stats?.goalsConceded : 0}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-bold">{team.stats?.points}</p>
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

export default StandingsTable;
