'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Trophy, Medal, Award } from 'lucide-react';
import type { Player } from '@/domains/player/contracts';

type TopPlayersTableProps = {
  players: Player[];
  limit?: number;
  title?: string;
};

const TableHeader = ({ label, className }: { label: string; className?: string }) => {
  return (
    <th className={`px-3 py-3 text-center text-sm font-semibold text-muted-foreground ${className ?? ''}`}>{label}</th>
  );
};

const PositionIcon = ({ position }: { position: number }) => {
  if (position === 1) {
    return (
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
        <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      </div>
    );
  }
  if (position === 2) {
    return (
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
        <Medal className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </div>
    );
  }
  if (position === 3) {
    return (
      <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
        <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
      </div>
    );
  }
  return (
    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground">
      {position}
    </div>
  );
};

const TopPlayersTable = ({ players, limit, title = 'Top Players' }: TopPlayersTableProps) => {
  const router = useRouter();

  const handleRowClick = (playerId: string) => {
    router.push(`/players/${playerId}`);
  };

  const displayedPlayers = limit ? players.slice(0, limit) : players;

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <Users className="h-6 w-6 text-yellow-500" />
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <TableHeader label="#" />
              <TableHeader label="Player" className="text-left" />
              <TableHeader label="G" />
              <TableHeader label="A" />
              <TableHeader label="YC" />
              <TableHeader label="RC" />
              <TableHeader label="OG" />
            </tr>
          </thead>
          <tbody>
            {displayedPlayers.map((player, index) => {
              const position = index + 1;

              return (
                <tr
                  key={player.id}
                  onClick={() => handleRowClick(player.id)}
                  className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <td className="px-3 py-4 text-center">
                    <PositionIcon position={position} />
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <Link
                        href={`/teams/${player.team?.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                      >
                        {player.team?.name}
                      </Link>
                      {' · '}
                      {player.position}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-bold">{player.stats?.goals}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.stats?.assists}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.stats?.yellowCards}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.stats?.redCards}</p>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <p className="font-medium">{player.stats?.ownGoals}</p>
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

export default TopPlayersTable;
