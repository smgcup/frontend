'use client';

import { Calendar, Clock, Check, X, CheckCheck, TrendingUpDown, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { predictorTheme, boosterTheme } from '@/lib/gamemodeThemes';
import type { Prediction } from '../contracts';
import { MatchStatus } from '@/graphql';

type PredictionResultCardProps = {
  prediction: Prediction;
  compact?: boolean;
};

const PredictionResultCard = ({ prediction, compact }: PredictionResultCardProps) => {
  const { match, predictedScore1, predictedScore2, isBoosted, isExactCorrect, isOutcomeCorrect, pointsEarned } =
    prediction;

  // Use booster theme when boosted
  const theme = isBoosted ? boosterTheme : predictorTheme;

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
        icon: <CheckCheck className="h-4 w-4" />,
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
    predictedScore1 > predictedScore2 ? 'home' : predictedScore1 < predictedScore2 ? 'away' : 'draw';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full',
        theme.shadowSubtle,
        isBoosted && 'border-purple-500/50 shadow-purple-500/20 shadow-lg',
      )}
    >
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          theme.gradientOverlay,
        )}
      />

      {/* Booster glow effect */}
      {isBoosted && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-purple-500/5 pointer-events-none" />
      )}

      {/* Accent line at top */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', theme.gradientLine)} />

      <div className="relative p-6 flex flex-col h-full pt-7">
        {/* Header with status and accuracy badge */}
        {compact ? (
          <div className="flex items-center justify-center gap-2 mb-6">
            {isBoosted && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-500">
                <Zap className="h-3.5 w-3.5 shrink-0 fill-purple-500" />
                2x Boosted
              </span>
            )}
            {accuracyBadge && (
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border shrink-0',
                  accuracyBadge.className,
                )}
              >
                {accuracyBadge.icon}
                {accuracyBadge.text === 'Correct Outcome' ? (
                  <span className="flex flex-col sm:flex-row sm:gap-1 items-start sm:items-center leading-tight">
                    <span>Correct</span>
                    <span>Outcome</span>
                  </span>
                ) : (
                  <span>{accuracyBadge.text}</span>
                )}
              </span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 items-center gap-2 mb-6">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              {isBoosted ? (
                <>
                  <Zap className="h-3.5 w-3.5 shrink-0 text-purple-500 fill-purple-500" />
                  <span className="text-purple-500 font-semibold">2x Boosted</span>
                </>
              ) : (
                <>
                  <TrendingUpDown className="h-3.5 w-3.5 shrink-0" />
                  <span>Prediction</span>
                </>
              )}
            </div>
            <div className="flex items-center justify-center">
              {accuracyBadge && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border shrink-0',
                    accuracyBadge.className,
                  )}
                >
                  {accuracyBadge.icon}
                  {accuracyBadge.text === 'Correct Outcome' ? (
                    <span className="flex flex-col sm:flex-row sm:gap-1 items-start sm:items-center leading-tight">
                      <span>Correct</span>
                      <span>Outcome</span>
                    </span>
                  ) : (
                    <span>{accuracyBadge.text}</span>
                  )}
                </span>
              )}
            </div>
            <div className="flex items-center justify-end">
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap shrink-0',
                  statusConfig.className,
                )}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
        )}

        {/* Teams and Scores */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Home Team */}
          <div className="flex-1">
            <div className="block text-center">
              <Link
                href={`/teams/${match.firstOpponent.id}`}
                className="text-2xl font-bold tracking-tight hover:underline"
              >
                {match.firstOpponent.name}
              </Link>
              {/* Predicted Score */}
              <div
                className={cn(
                  'text-3xl font-black mt-2 transition-all',
                  predictedWinner === 'home' ? theme.scoreWinner : theme.scoreLoser,
                )}
              >
                {predictedScore1}
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <span className="relative text-2xl font-black text-primary">VS</span>
            </div>
            {isCompleted && actualScore1 !== undefined && actualScore2 !== undefined && (
              <div className="mt-2 text-sm font-semibold text-muted-foreground">
                FT: {actualScore1} - {actualScore2}
              </div>
            )}
            {isCompleted && pointsEarned !== undefined && (
              <div className={cn('mt-1 text-xs font-semibold', theme.pointsText)}>{pointsEarned} pts</div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex-1">
            <div className="block text-center">
              <Link
                href={`/teams/${match.secondOpponent.id}`}
                className="text-2xl font-bold tracking-tight hover:underline"
              >
                {match.secondOpponent.name}
              </Link>
              {/* Predicted Score */}
              <div
                className={cn(
                  'text-3xl font-black mt-2 transition-all',
                  predictedWinner === 'away' ? theme.scoreWinner : theme.scoreLoser,
                )}
              >
                {predictedScore2}
              </div>
            </div>
          </div>
        </div>

        {/* Date and Time */}
        {!compact && (
          <div className="pt-4 border-t space-y-2.5 mt-auto mb-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className={cn('h-4 w-4', theme.iconMuted)} />
              <span className="font-medium">{match.date ? formatDate(match.date) : 'TBD'}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className={cn('h-4 w-4', theme.iconMuted)} />
              <span className="font-medium">{match.date ? formatTime(match.date) : 'TBD'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionResultCard;
