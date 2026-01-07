'use client';

import React from 'react';
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
import { Loader2, Pencil, Plus, Trash2, User, Users } from 'lucide-react';
import type { TeamsWithPlayersQuery } from '@/graphql';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import { useAdminTeams } from './hooks/useAdminTeams';

type AdminTeamsViewUiProps = {
  teams: TeamsWithPlayersQuery['teams'];
  error?: unknown;
};

const AdminTeamsViewUi = ({ teams, error }: AdminTeamsViewUiProps) => {
  const { actionError, deletingTeamId, onDeleteTeam } = useAdminTeams();

  if (error) {
    return (
      <div className="p-4">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>Error loading teams. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader
        title="Teams"
        subtitle={`${teams.length} total`}
        description="Create, edit, or delete teams"
        actions={
          <>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/teams/create">
                <Plus className="mr-2 h-4 w-4" />
                Create team
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/players">
                <User className="mr-2 h-4 w-4" />
                View players
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

      {/* Teams Section */}
      <div>
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Teams ({teams.length})
        </h2>

        {/* Mobile: accordion list */}
        <div className="md:hidden">
          <Accordion type="multiple" className="gap-2">
            {teams.map((team) => (
              <AccordionItem key={team.id} value={team.id} className="border-none">
                <AccordionTrigger className="bg-card px-3 hover:no-underline ring-1 ring-foreground/10 items-center **:data-[slot=accordion-trigger-icon]:size-5">
                  <div className="flex w-full items-center justify-between gap-3">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{team.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {team.players?.length ?? 0} {team.players?.length === 1 ? 'player' : 'players'}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="flex flex-col gap-2 pt-2">
                    <Button asChild variant="outline">
                      <Link
                        href={`/admin/teams/${team.id}/edit`}
                        className="no-underline! hover:no-underline! focus:no-underline!"
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit team
                      </Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="cursor-pointer">
                          {deletingTeamId === team.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 h-4 w-4" />
                          )}
                          Delete team
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
                          <AlertDialogAction variant="destructive" onClick={() => onDeleteTeam(team.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {team.players?.length ?? 0} {team.players?.length === 1 ? 'player' : 'players'}
                    </p>
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
                          className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
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
                          <AlertDialogAction variant="destructive" onClick={() => onDeleteTeam(team.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {team.players && team.players.length > 0
                    ? `Team has ${team.players.length} ${team.players.length === 1 ? 'player' : 'players'}.`
                    : 'No players assigned yet.'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTeamsViewUi;
