'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
import { Pencil, Trash2, Calendar, Clock, Loader2, Radio, Trophy, MapPin, MoreVertical, Play, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Match } from '@/domains/matches/contracts';
import { MatchStatus } from '@/graphql';
import { formatLocation } from '../../utils/formatLocation';

type AdminMatchCardProps = {
  match: Match;
  deleteLoading: boolean;
  deletingId: string | null;
  showMatchId: string | null;
  onDeleteMatch: (id: string) => Promise<void>;
  onToggleMatchId: (id: string) => void;
  startingId: string | null;
  onStartMatch: (id: string) => Promise<void>;
};

const AdminMatchCard = ({
  match,
  deleteLoading,
  deletingId,
  showMatchId,
  onDeleteMatch,
  onToggleMatchId,
  startingId,
  onStartMatch,
}: AdminMatchCardProps) => {
  //TODO: Extract to a helper function in the utils folder
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '-';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '-';
    }
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
        className: 'bg-red-500/10 text-red-600 dark:text-red-400',
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
    await onDeleteMatch(id);
  };

  const statusConfig = getStatusConfig(match.status);
  const showScore = match.status === 'FINISHED' || match.status === 'LIVE';

  return (
    <div className="group relative overflow-visible rounded-xl border bg-card/50 backdrop-blur-sm flex flex-col h-full">
      <div className="relative p-6 flex flex-col h-full">
        {/* Header section: Match ID and status badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" />
            {/* Match ID Popup */}
            {showMatchId === match.id && (
              <div
                data-match-popup
                className="absolute -top-12 left-0 z-50 bg-popover text-popover-foreground px-3 py-1.5 rounded-lg shadow-lg border text-xs font-medium whitespace-nowrap"
              >
                Match #{match.id}
                <div className="absolute left-6 bottom-0 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-border"></div>
                <div className="absolute left-6 bottom-0 translate-y-[calc(100%-1px)] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-popover"></div>
              </div>
            )}
            <span
              data-match-text
              className="cursor-pointer hover:text-foreground transition-colors"
              onClick={() => onToggleMatchId(match.id)}
            >
              Match
            </span>
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
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* First opponent */}
          <div className="flex-1">
            <div className="text-center group/team">
              <Link
                href={`/admin/teams/${match.firstOpponent.id}/edit`}
                className="text-2xl font-bold tracking-tight group-hover/team:text-primary transition-colors underline block"
                onClick={(e) => e.stopPropagation()}
              >
                {match.firstOpponent.name}
              </Link>
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
              <Link
                href={`/admin/teams/${match.secondOpponent.id}/edit`}
                className="text-2xl font-bold tracking-tight group-hover/team:text-primary transition-colors underline block"
                onClick={(e) => e.stopPropagation()}
              >
                {match.secondOpponent.name}
              </Link>
              {/* Show score if match is LIVE or FINISHED and score exists */}
              {showScore && match.score2 !== undefined && (
                <div className="text-3xl font-black mt-2 text-primary">{match.score2}</div>
              )}
            </div>
          </div>
        </div>

        {/* Match details section: Date, time, and venue information */}
        <div className="pt-4 border-t space-y-2.5 mt-auto mb-4">
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
            <span className="font-medium">{formatLocation(match.location)}</span>
          </div>
        </div>

        {/* Admin Actions section: Buttons for managing the match */}
        <div className="pt-4 border-t flex items-center justify-end gap-2">
          {/* Show "Start Match" button for SCHEDULED matches */}
          {match.status === MatchStatus.Scheduled && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onStartMatch(match.id)}
              disabled={startingId === match.id}
            >
              {startingId === match.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {startingId === match.id ? 'Starting...' : 'Start Match'}
            </Button>
          )}
          {/* Show "Manage Live" button only for LIVE matches */}
          {match.status === 'LIVE' && (
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link href={`/admin/matches/${match.id}/live`}>
                <Radio className="h-4 w-4" />
                Manage Live
              </Link>
            </Button>
          )}
          {/* Show "Appearances" button for FINISHED matches */}
          {match.status === MatchStatus.Finished && (
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link href={`/admin/matches/${match.id}/appearances`}>
                <Users className="h-4 w-4" />
                Appearances
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
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </>
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
};

export default AdminMatchCard;
