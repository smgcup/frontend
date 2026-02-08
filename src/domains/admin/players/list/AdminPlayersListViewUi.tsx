'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchInput } from '@/domains/admin/components/search-input';
import { Loader2, Pencil, Plus, Trash2, User } from 'lucide-react';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';

type AdminPlayersListViewUiProps = {
  teams: Team[];
  players: Player[];
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTeamId: string | 'all';
  onTeamChange: (teamId: string | 'all') => void;
  actionError: string | null;
  deletingPlayerId: string | null;
  onDeletePlayer: (id: string) => Promise<void>;
};

const AdminPlayersListViewUi = ({
  teams,
  players,
  totalCount,
  searchQuery,
  onSearchChange,
  selectedTeamId,
  onTeamChange,
  actionError,
  deletingPlayerId,
  onDeletePlayer,
}: AdminPlayersListViewUiProps) => {
  const playerTeamNameByPlayerId = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teams) {
      for (const player of team?.players ?? []) {
        if (player.id) {
          map.set(player.id, team.name);
        }
      }
    }
    return map;
  }, [teams]);

  const isFiltered = searchQuery.trim() || selectedTeamId !== 'all';
  const subtitle = isFiltered ? `${players.length} of ${totalCount}` : `${totalCount} total`;

  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader
        title="Players"
        subtitle={subtitle}
        description="Create, edit, or delete players"
        actions={
          <>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/players/create">
                <Plus className="mr-2 h-4 w-4" />
                Create player
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/teams">
                <User className="mr-2 h-4 w-4" />
                View teams
              </Link>
            </Button>
          </>
        }
      />

      {totalCount > 0 && (
        <div className="grid grid-cols-[2fr_1fr] gap-3 w-full">
          <SearchInput placeholder="Search player name" value={searchQuery} onChange={onSearchChange} />
          <div className="min-w-0 w-full flex justify-end">
            <Select value={selectedTeamId} onValueChange={(v) => onTeamChange(v as string | 'all')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {actionError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Operation failed</p>
          <p className="mt-1 text-sm">{actionError}</p>
        </div>
      )}

      {players.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            {isFiltered ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No players found</h3>
                <p className="text-muted-foreground text-center max-w-sm">
                  No players match your filters. Try a different search or team.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No players yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-sm">
                  Get started by creating your first player
                </p>
                <Button asChild>
                  <Link href="/admin/players/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Player
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players
            .filter((player): player is Player & { id: string } => !!player.id)
            .map((player) => (
              <Card
                key={player.id}
                className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">
                        {player.firstName} {player.lastName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{player.position}</p>
                      <p className="text-xs text-muted-foreground">
                        Team: <span className="text-foreground">{playerTeamNameByPlayerId.get(player.id) ?? '—'}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                        <Link href={`/admin/players/${player.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit player</span>
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            {deletingPlayerId === player.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete player</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Player</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {player.firstName} {player.lastName}? This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={() => onDeletePlayer(player.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Age: {player.age} years</p>
                    <p className="text-muted-foreground">Height: {player.height ?? '—'} cm</p>
                    <p className="text-muted-foreground">Weight: {player.weight ?? '—'} kg</p>
                    <p className="text-muted-foreground">Foot: {player.preferredFoot ?? '—'}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default AdminPlayersListViewUi;
