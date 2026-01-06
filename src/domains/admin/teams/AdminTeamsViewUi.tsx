'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Loader2, Pencil, Plus, Trash2, Users, User } from 'lucide-react';
import Image from 'next/image';
import { playerIcon, teamIcon } from '@/public/icons';
import type {
  DeletePlayerMutation,
  DeletePlayerMutationVariables,
  DeleteTeamMutation,
  DeleteTeamMutationVariables,
  TeamsWithPlayersQuery,
} from '@/graphql';
import { DeletePlayerDocument, DeleteTeamDocument } from '@/graphql';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';

type Player = NonNullable<TeamsWithPlayersQuery['teams'][0]['players']>[0];

type AdminTeamsViewUiProps = {
  teams: TeamsWithPlayersQuery['teams'];
  players: Player[];
  error?: unknown;
};

const AdminTeamsViewUi = ({ teams, players, error }: AdminTeamsViewUiProps) => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  const [deleteTeamMutation] = useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(DeleteTeamDocument);
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

  const handleDeleteTeam = async (id: string) => {
    setActionError(null);
    setDeletingTeamId(id);
    try {
      await deleteTeamMutation({ variables: { id } });
      router.refresh();
    } catch (e) {
      setActionError(getErrorMessage(e));
    } finally {
      setDeletingTeamId(null);
    }
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
          <p>Error loading teams and players. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-10">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams & Players</h1>
          <p className="mt-2 text-muted-foreground">Manage teams and players in the tournament</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/teams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/admin/players/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Player
            </Link>
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p className="font-medium">Operation failed</p>
          <p className="mt-1 text-sm">{actionError}</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image src={teamIcon} alt="Team Icon" width={24} height={24} />
              Total Teams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{teams.length}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image src={playerIcon} alt="Player Icon" width={24} height={24} />
              Total Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{players.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Teams Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Teams ({teams.length})
        </h2>

        {/* Mobile: accordion list */}
        <div className="md:hidden">
          <Accordion type="multiple" className="gap-2">
            {teams.map((team) => {
              const count = team.players?.length ?? 0;
              return (
                <AccordionItem key={team.id} value={team.id} className="border-none">
                  <AccordionTrigger className="bg-card px-3 hover:no-underline ring-1 ring-foreground/10">
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="font-medium">{team.name}</span>
                      <span className="text-xs text-muted-foreground">{count} players</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-3">
                    {team.players && team.players.length > 0 ? (
                      <ul className="space-y-2">
                        {team.players.map((player) => (
                          <li
                            key={player.id}
                            className="flex items-start justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {player.firstName} {player.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {player.position} • {player.prefferedFoot}
                              </p>
                            </div>
                            <div className="shrink-0 text-right text-xs text-muted-foreground">
                              <p>{currentYear - Math.round(player.yearOfBirth)}y</p>
                              <p>{player.height}cm</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No players assigned</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* Desktop: grid cards */}
        <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="truncate">{team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{team.players?.length ?? 0} players</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                      <Link href={`/admin/teams/${team.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit team</span>
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          {deletingTeamId === team.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete team</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Team</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{team.name}&quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction variant="destructive" onClick={() => handleDeleteTeam(team.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {team.players && team.players.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Players:</p>
                    <ul className="space-y-1">
                      {team.players.slice(0, 5).map((player) => (
                        <li key={player.id} className="text-sm flex items-center justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <User className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {player.firstName} {player.lastName}
                            </span>
                            <span className="shrink-0 text-muted-foreground">({player.position})</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
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
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                                    Are you sure you want to delete {player.firstName} {player.lastName}? This action
                                    cannot be undone.
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
                        </li>
                      ))}
                      {team.players.length > 5 && (
                        <li className="text-sm text-muted-foreground">+{team.players.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No players assigned</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Players Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          All Players ({players.length})
        </h2>

        {/* Mobile: accordion list */}
        <div className="md:hidden">
          <Accordion type="multiple" className="gap-2">
            {players.map((player) => (
              <AccordionItem key={player.id} value={player.id} className="border-none">
                <AccordionTrigger className="bg-card px-3 hover:no-underline ring-1 ring-foreground/10">
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="truncate font-medium">
                      {player.firstName} {player.lastName}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{player.position}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-md border bg-muted/30 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="font-medium">{currentYear - Math.round(player.yearOfBirth)}</p>
                    </div>
                    <div className="rounded-md border bg-muted/30 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Foot</p>
                      <p className="font-medium">{player.prefferedFoot}</p>
                    </div>
                    <div className="rounded-md border bg-muted/30 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="font-medium">{player.height} cm</p>
                    </div>
                    <div className="rounded-md border bg-muted/30 px-3 py-2">
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-medium">{player.weight} kg</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Desktop: grid cards */}
        <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {players.map((player) => (
            <Card key={player.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base truncate">
                      {player.firstName} {player.lastName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{player.position}</p>
                    <p className="text-xs text-muted-foreground">
                      Team:{' '}
                      <span className="text-foreground">{playerTeamNameByPlayerId.get(player.id) ?? '—'}</span>
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
      </div>
    </div>
  );
};

export default AdminTeamsViewUi;
