'use client';

import { Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import PositionBadge from '@/components/PositionBadge';

type Team = {
  id: string;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

type TableHeaderProps = {
  label: string;
};

const TableHeader = ({ label }: TableHeaderProps) => {
  return <th className="px-3 py-3 text-center text-sm font-semibold text-muted-foreground">{label}</th>;
};

const Table = ({ teams }: { teams: Team[] }) => {
  const router = useRouter();

  const handleRowClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <h3 className="text-2xl font-bold">Standings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <TableHeader label="Pos" />
              <TableHeader label="Team" />
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
            {teams.map((team, index) => (
              <tr
                key={team.id}
                onClick={() => handleRowClick(team.id)}
                className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <td className="px-3 py-4 text-center">
                  <PositionBadge position={index + 1} />
                </td>
                <td className="px-4 py-4">
                  <p className="font-semibold">{team.name}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p className="font-medium">{team.played}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p className="font-medium">{team.won}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p className="font-medium">{team.drawn}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p className="font-medium">{team.lost}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p className="font-medium">{team.goalsFor}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p className="font-medium">{team.goalsAgainst}</p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p
                    className={cn(
                      'font-medium',
                      team.goalDifference > 0 && 'text-green-600 dark:text-green-400',
                      team.goalDifference < 0 && 'text-red-600 dark:text-red-400',
                    )}
                  >
                    {team.goalDifference > 0 ? '+' : ''}
                    {team.goalDifference}
                  </p>
                </td>
                <td className="px-3 py-4 text-center">
                  <p className="font-bold">{team.points}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
