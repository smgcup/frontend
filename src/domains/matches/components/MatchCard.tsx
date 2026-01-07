import type React from 'react';
import { Calendar, Clock, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatchListItem } from '../ssr/getMatchesPageData';

type MatchCardProps = {
  match: MatchListItem;
};

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('bg-BG', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'Europe/Sofia',
    }).format(new Date(dateString));

  const formatTime = (dateString: string) =>
    new Intl.DateTimeFormat('bg-BG', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Sofia',
    }).format(new Date(dateString));

  const statusConfig = (() => {
    const statusMap: Record<MatchListItem['status'], { label: string; className: string }> = {
      SCHEDULED: { label: 'Upcoming', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      LIVE: { label: '● Live', className: 'bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse' },
      FINISHED: { label: 'Completed', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
      CANCELLED: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' },
    };
    return statusMap[match.status];
  })();

  const showScore = match.status === 'FINISHED' || match.status === 'LIVE';

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" />
            <span>Match</span>
          </div>
          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              statusConfig.className,
            )}
          >
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="block text-center">
              <div className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                {match.firstOpponent.name}
              </div>
              {showScore && match.score1 !== undefined && (
                <div className="text-3xl font-black mt-2 text-primary">{match.score1}</div>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            {match.status === 'FINISHED' ? (
              <span className="text-2xl font-bold text-muted-foreground/30">—</span>
            ) : match.status === 'CANCELLED' ? (
              <span className="text-2xl font-bold text-muted-foreground/30">×</span>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <span className="relative text-3xl font-black text-primary">VS</span>
                </div>
              </>
            )}
          </div>

          <div className="flex-1">
            <div className="block text-center">
              <div className="text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                {match.secondOpponent.name}
              </div>
              {showScore && match.score2 !== undefined && (
                <div className="text-3xl font-black mt-2 text-primary">{match.score2}</div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2.5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span className="font-medium">{formatDate(match.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span className="font-medium">{formatTime(match.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
