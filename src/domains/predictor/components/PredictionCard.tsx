'use client';

import { Calendar, Clock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Match } from '@/domains/matches/contracts';
import { Button } from '@/components/ui/button';

type PredictionCardProps = {
  match: Match;
  currentPrediction?: string;
  onPredict: (prediction: string) => void;
};

const PredictionCard = ({ match, currentPrediction, onPredict }: PredictionCardProps) => {
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));

  const formatTime = (dateString: string) =>
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));

  const team1Id = match.firstOpponent.id;
  const team2Id = match.secondOpponent.id;
  const drawId = 'draw';

  const isTeam1Selected = currentPrediction === team1Id;
  const isTeam2Selected = currentPrediction === team2Id;
  const isDrawSelected = currentPrediction === drawId;
  const hasPrediction = !!currentPrediction;

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5">
      {/* Orange accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-400 via-orange-500 to-amber-500" />

      <div className="p-5 pt-6">
        {/* Date and Time */}
        <div className="flex items-center justify-between mb-5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500/70" />
            <span>{formatDate(match.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500/70" />
            <span>{formatTime(match.date)}</span>
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          {/* Team 1 */}
          <button
            onClick={() => onPredict(team1Id)}
            className={cn(
              'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200',
              isTeam1Selected
                ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                : 'border-border hover:border-orange-500/50 hover:bg-muted/50',
            )}
          >
            <span className={cn('font-semibold text-lg', isTeam1Selected && 'text-orange-600 dark:text-orange-400')}>
              {match.firstOpponent.name}
            </span>
            {isTeam1Selected && (
              <div className="flex items-center gap-1.5 text-orange-500">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Win</span>
              </div>
            )}
          </button>

          {/* Draw */}
          <button
            onClick={() => onPredict(drawId)}
            className={cn(
              'w-full flex items-center justify-center p-3 rounded-lg border-2 transition-all duration-200',
              isDrawSelected
                ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                : 'border-border hover:border-orange-500/50 hover:bg-muted/50',
            )}
          >
            <span
              className={cn(
                'font-medium text-muted-foreground',
                isDrawSelected && 'text-orange-600 dark:text-orange-400',
              )}
            >
              Draw
            </span>
            {isDrawSelected && <Check className="h-4 w-4 ml-2 text-orange-500" />}
          </button>

          {/* Team 2 */}
          <button
            onClick={() => onPredict(team2Id)}
            className={cn(
              'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200',
              isTeam2Selected
                ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-500/20'
                : 'border-border hover:border-orange-500/50 hover:bg-muted/50',
            )}
          >
            <span className={cn('font-semibold text-lg', isTeam2Selected && 'text-orange-600 dark:text-orange-400')}>
              {match.secondOpponent.name}
            </span>
            {isTeam2Selected && (
              <div className="flex items-center gap-1.5 text-orange-500">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Win</span>
              </div>
            )}
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-5 pt-4 border-t">
          <Button
            className={cn(
              'w-full transition-all',
              hasPrediction
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
            disabled={!hasPrediction}
          >
            {hasPrediction ? 'Save Prediction' : 'Select a Winner'}
          </Button>
          {hasPrediction && <p className="text-xs text-center text-muted-foreground mt-2">Login required to save</p>}
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
