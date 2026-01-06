'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
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
import { Loader2, Pencil, Plus, Trash2, User } from 'lucide-react';
import type { DeletePlayerMutation, DeletePlayerMutationVariables, TeamsWithPlayersQuery } from '@/graphql';
import { DeletePlayerDocument } from '@/graphql';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';

type Player = NonNullable<TeamsWithPlayersQuery['teams'][0]['players']>[0];

type AdminPlayersListViewUiProps = {
  teams: TeamsWithPlayersQuery['teams'];
  players: Player[];
  currentYear: number;
  error?: unknown;
};

const AdminPlayersListViewUi = ({ teams, players, currentYear, error }: AdminPlayersListViewUiProps) => {
  const router = useRouter();

  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  const [deletePlayerMutation] = useMutation<DeletePlayerMutation, DeletePlayerMutationVariables>(DeletePlayerDocument);

  const playerTeamNameByPlayerId = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teams) {
      const teamPlayers = team.players ?? [];
      for (const player of teamPlayers) {
        map.set(player.id, team.name);
      }
    }
    return map;
  }, [teams]);

  const getErrorMessage = (e: unknown) => {
    if (!e) return 'Unknown error';
    if (typeof e === 'string') return e;
    if (typeof e === 'object' && e && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
      return (e as { message: string }).message;
    }
    return String(e);
  };

  const handleDeletePlayer = async (id: string) => {
    setActionError(null);
    setDeletingPlayerId(id);
    try {
      await deletePlayerMutation({ variables: { id } });
      router.refresh();
    } catch (e) {
      setActionError(getErrorMessage(e));
    } finally {
      setDeletingPlayerId(null);
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>Error loading players. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader
        title="Players"
        subtitle={`${players.length} total`}
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
            <h3 className="text-lg font-semibold mb-2">No players yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">Get started by creating your first player</p>
            <Button asChild>
              <Link href="/admin/players/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Player
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map((player) => (
            <Card key={player.id} className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/20">
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
                            Are you sure you want to delete {player.firstName} {player.lastName}? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction variant="destructive" onClick={() => handleDeletePlayer(player.id)}>
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
                  <p className="text-muted-foreground">Age: {currentYear - Math.round(player.yearOfBirth)}</p>
                  <p className="text-muted-foreground">Height: {player.height} cm</p>
                  <p className="text-muted-foreground">Weight: {player.weight} kg</p>
                  <p className="text-muted-foreground">Foot: {player.prefferedFoot}</p>
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


