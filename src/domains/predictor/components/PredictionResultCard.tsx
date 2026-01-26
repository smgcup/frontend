'use client';

import { Calendar, Clock, Check, X, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Prediction } from '../contracts';
import { MatchStatus } from '@/graphql';

type PredictionResultCardProps = {
  prediction: Prediction;
};

const PredictionResultCard = ({ prediction }: PredictionResultCardProps) => {
  const { match, predictedHomeScore, predictedAwayScore, isExactCorrect, isOutcomeCorrect, pointsEarned } = prediction;

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

  const isCompleted = match.status === MatchStatus.Finished;
  const actualScore1 = match.score1;
  const actualScore2 = match.score2;

  const statusConfig = (() => {
    const statusMap: Record<MatchStatus, { label: string; className: string }> = {
      [MatchStatus.Scheduled]: { label: 'Upcoming', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
      [MatchStatus.Live]: { label: '● Live', className: 'bg-red-500/10 text-red-600 dark:text-red-400' },
      [MatchStatus.Finished]: { label: 'Completed', className: 'bg-green-500/10 text-green-600 dark:text-green-400' },
      [MatchStatus.Cancelled]: { label: 'Cancelled', className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400' },
    };
    return statusMap[match.status];
  })();

  const getAccuracyBadge = () => {
    if (!isCompleted) return null;

    if (isExactCorrect) {
      return {
        text: 'Exact Match',
        icon: <Target className="h-4 w-4" />,
        className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      };
    }
    if (isOutcomeCorrect) {
      return {
        text: 'Correct Outcome',
        icon: <Check className="h-4 w-4" />,
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      };
    }
    return {
      text: 'Incorrect',
      icon: <X className="h-4 w-4" />,
      className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    };
  };

  const accuracyBadge = getAccuracyBadge();

  // Determine if predicted winner matches actual winner
  const predictedWinner =
    predictedHomeScore > predictedAwayScore ? 'home' : predictedHomeScore < predictedAwayScore ? 'away' : 'draw';

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 flex flex-col h-full">
      <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Orange accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-400 via-orange-500 to-amber-500" />

      <div className="relative p-6 flex flex-col h-full pt-7">
        {/* Header with status and accuracy badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Target className="h-3.5 w-3.5" />
            <span>Prediction</span>
          </div>
          <div className="flex items-center gap-2">
            {accuracyBadge && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border',
                  accuracyBadge.className,
                )}
              >
                {accuracyBadge.icon}
                {accuracyBadge.text}
              </span>
            )}
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                statusConfig.className,
              )}
            >
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Teams and Scores */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Home Team */}
          <div className="flex-1">
            <div className="block text-center">
              <div className="text-2xl font-bold tracking-tight">{match.firstOpponent.name}</div>
              {/* Predicted Score */}
              <div
                className={cn(
                  'text-3xl font-black mt-2 transition-all',
                  predictedWinner === 'home' ? 'text-orange-500' : 'text-muted-foreground/50',
                )}
              >
                {predictedHomeScore}
              </div>
              {/* Actual Score (if completed) */}
              {isCompleted && actualScore1 !== undefined && (
                <div
                  className={cn(
                    'text-lg font-semibold mt-1',
                    actualScore1 === predictedHomeScore
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground',
                  )}
                >
                  Actual: {actualScore1}
                </div>
              )}
            </div>
          </div>

          {/* VS Divider */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <span className="relative text-2xl font-black text-primary">VS</span>
            </div>
            {isCompleted && pointsEarned !== undefined && (
              <div className="mt-2 text-xs font-semibold text-orange-500">{pointsEarned} pts</div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1">
            <div className="block text-center">
              <div className="text-2xl font-bold tracking-tight">{match.secondOpponent.name}</div>
              {/* Predicted Score */}
              <div
                className={cn(
                  'text-3xl font-black mt-2 transition-all',
                  predictedWinner === 'away' ? 'text-orange-500' : 'text-muted-foreground/50',
                )}
              >
                {predictedAwayScore}
              </div>
              {/* Actual Score (if completed) */}
              {isCompleted && actualScore2 !== undefined && (
                <div
                  className={cn(
                    'text-lg font-semibold mt-1',
                    actualScore2 === predictedAwayScore
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-muted-foreground',
                  )}
                >
                  Actual: {actualScore2}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className="pt-4 border-t space-y-2.5 mt-auto mb-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-orange-500/70" />
            <span className="font-medium">{match.date ? formatDate(match.date) : 'TBD'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-orange-500/70" />
            <span className="font-medium">{match.date ? formatTime(match.date) : 'TBD'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResultCard;
