'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, Pencil, Trash2, Calendar, Clock, Loader2, Radio, Trophy, MapPin, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Match } from '@/domains/matches/contracts';

/**
 * Props for the AdminMatchesListViewUi component
 */
type AdminMatchesListViewUiProps = {
  matches: Match[]; // Array of matches to display
  deleteLoading: boolean; // Whether a delete operation is in progress
  onDeleteMatch: (id: string) => Promise<void>; // Callback function to delete a match
};

const AdminMatchesListViewUi = ({ matches, deleteLoading, onDeleteMatch }: AdminMatchesListViewUiProps) => {
  // Track which match is currently being deleted (for showing loading state on specific match)
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: Match['status']) => {
    const statusMap = {
      SCHEDULED: {
        label: 'Upcoming',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      },
      LIVE: {
        label: '● Live',
        className: 'bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse',
      },
      FINISHED: {
        label: 'Completed',
        className: 'bg-green-500/10 text-green-600 dark:text-green-400',
      },
      CANCELLED: {
        label: 'Cancelled',
        className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
      },
    };
    return statusMap[status];
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDeleteMatch(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-8 py-4 lg:p-10">
      <AdminPageHeader
        title="Matches"
        subtitle={`${matches.length} total`}
        description="Create, edit, and manage matches"
        actions={
          <Button asChild className="gap-2 w-full sm:w-auto">
            <Link href="/admin/matches/create">
              <Plus className="h-4 w-4" />
              Create match
            </Link>
          </Button>
        }
      />

      {matches.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No matches yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">Get started by creating your first match</p>
            <Button asChild>
              <Link href="/admin/matches/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Match
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => {
            // Get styling configuration for the match status badge
            const statusConfig = getStatusConfig(match.status);
            // Only show scores for LIVE or FINISHED matches
            const showScore = match.status === 'FINISHED' || match.status === 'LIVE';

            return (
              /* Individual match card */
              <div
                key={match.id}
                className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm"
              >
                <div className="relative p-6 flex flex-col space-y-6">
                  {/* Header section: Match ID and status badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Trophy className="h-3.5 w-3.5" />
                      <span>Match #{match.id}</span>
                    </div>
                    {/* Status Badge: Shows match status with appropriate color coding */}
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                        statusConfig.className,
                      )}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Teams and Score section: Displays both opponents and their scores */}
                  <div className="flex items-center justify-between gap-4">
                    {/* First opponent */}
                    <div className="flex-1">
                      <div className="text-center group/team">
                        <div className="text-2xl font-bold tracking-tight group-hover/team:text-primary transition-colors">
                          {match.firstOpponent.name}
                        </div>
                        {/* Show score if match is LIVE or FINISHED and score exists */}
                        {showScore && match.score1 !== undefined && (
                          <div className="text-3xl font-black mt-2 text-primary">{match.score1}</div>
                        )}
                      </div>
                    </div>

                    {/* VS separator: Shows "VS" for upcoming matches, "—" for finished matches */}
                    <div className="shrink-0 flex flex-col items-center">
                      {match.status === 'FINISHED' ? (
                        <span className="text-2xl font-bold text-muted-foreground/30">—</span>
                      ) : (
                        <>
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <span className="relative text-3xl font-black text-primary">VS</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Second opponent */}
                    <div className="flex-1">
                      <div className="text-center group/team">
                        <div className="text-2xl font-bold tracking-tight group-hover/team:text-primary transition-colors">
                          {match.secondOpponent.name}
                        </div>
                        {/* Show score if match is LIVE or FINISHED and score exists */}
                        {showScore && match.score2 !== undefined && (
                          <div className="text-3xl font-black mt-2 text-primary">{match.score2}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match details section: Date, time, and venue information */}
                  <div className="pt-4 border-t space-y-2.5">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary/70" />
                      <span className="font-medium">{formatDate(match.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary/70" />
                      <span className="font-medium">{formatTime(match.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      <span className="font-medium">SMG Arena</span>
                    </div>
                  </div>

                  {/* Admin Actions section: Buttons for managing the match */}
                  <div className="pt-4 border-t flex items-center justify-end gap-2">
                    {/* Show "Manage Live" button only for LIVE matches */}
                    {match.status === 'LIVE' && (
                      <Button variant="outline" size="sm" asChild className="gap-2">
                        <Link href={`/admin/matches/${match.id}/live`}>
                          <Radio className="h-4 w-4" />
                          Manage Live
                        </Link>
                      </Button>
                    )}
                    {/* Dropdown menu with additional actions (Edit, Delete) */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Edit match option */}
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/matches/${match.id}/edit`} className="cursor-pointer">
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {/* Delete match option with confirmation dialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive cursor-pointer"
                            >
                              {/* Show loading state if this match is being deleted */}
                              {deletingId === match.id ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Deleting...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </div>
                              )}
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          {/* Confirmation dialog for deletion */}
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Match</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the match between {match.firstOpponent.name} and{' '}
                                {match.secondOpponent.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                variant="destructive"
                                onClick={() => handleDelete(match.id)}
                                disabled={deleteLoading || deletingId === match.id}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminMatchesListViewUi;
