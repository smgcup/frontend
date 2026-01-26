'use client';

import { Calendar, Clock, Minus, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Match } from '@/domains/matches/contracts';
import type { ScorePrediction } from '@/domains/predictor/contracts';
import { Button } from '@/components/ui/button';

type PredictionCardProps = {
  match: Match;
  prediction: ScorePrediction | null;
  onPredictionChange: (prediction: ScorePrediction) => void;
};

const PredictionCard = ({ match, prediction, onPredictionChange }: PredictionCardProps) => {
  //TODO: Extract to a helper function in the utils folder
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '-';
    }
    new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '-';
    }
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const homeScore = prediction?.homeScore ?? 0;
  const awayScore = prediction?.awayScore ?? 0;
  const hasPrediction = prediction !== null;

  const updateScore = (team: 'home' | 'away', delta: number) => {
    const currentHome = prediction?.homeScore ?? 0;
    const currentAway = prediction?.awayScore ?? 0;

    if (team === 'home') {
      const newScore = Math.max(0, Math.min(20, currentHome + delta));
      onPredictionChange({ homeScore: newScore, awayScore: currentAway });
    } else {
      const newScore = Math.max(0, Math.min(20, currentAway + delta));
      onPredictionChange({ homeScore: currentHome, awayScore: newScore });
    }
  };

  const getOutcomeLabel = () => {
    if (!hasPrediction) return null;
    if (homeScore > awayScore) return { text: `${match.firstOpponent.name} wins`, color: 'text-orange-500' };
    if (awayScore > homeScore) return { text: `${match.secondOpponent.name} wins`, color: 'text-orange-500' };
    return { text: 'Draw', color: 'text-muted-foreground' };
  };

  const outcome = getOutcomeLabel();

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
      {/* Orange accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-orange-400 via-orange-500 to-amber-500" />

      <div className="p-5 pt-6">
        {/* Date and Time */}
        <div className="flex items-center justify-center gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-orange-500/70" />
            <span>{formatDate(match.date)}</span>
          </div>
          <span className="text-muted-foreground/30">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-orange-500/70" />
            <span>{formatTime(match.date)}</span>
          </div>
        </div>

        {/* Score Prediction Layout: Team - Score - VS - Score - Team */}
        <div className="flex items-center justify-between gap-2">
          {/* Home Team */}
          <div className="flex-1 text-center">
            <div
              className={cn(
                'font-bold text-base leading-tight transition-colors',
                hasPrediction && homeScore > awayScore && 'text-orange-500',
              )}
            >
              {match.firstOpponent.name}
            </div>
          </div>

          {/* Home Score Control */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => updateScore('home', 1)}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors"
              aria-label="Increase home score"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-xl text-2xl font-bold transition-all',
                hasPrediction && homeScore > awayScore
                  ? 'bg-orange-500 text-white'
                  : 'bg-muted/50 border-2 border-border',
              )}
            >
              {homeScore}
            </div>
            <button
              type="button"
              onClick={() => updateScore('home', -1)}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={homeScore <= 0}
              aria-label="Decrease home score"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {/* VS Divider */}
          <div className="px-2">
            <span className="text-sm font-semibold text-muted-foreground">VS</span>
          </div>

          {/* Away Score Control */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => updateScore('away', 1)}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors"
              aria-label="Increase away score"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-xl text-2xl font-bold transition-all',
                hasPrediction && awayScore > homeScore
                  ? 'bg-orange-500 text-white'
                  : 'bg-muted/50 border-2 border-border',
              )}
            >
              {awayScore}
            </div>
            <button
              type="button"
              onClick={() => updateScore('away', -1)}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={awayScore <= 0}
              aria-label="Decrease away score"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div
              className={cn(
                'font-bold text-base leading-tight transition-colors',
                hasPrediction && awayScore > homeScore && 'text-orange-500',
              )}
            >
              {match.secondOpponent.name}
            </div>
          </div>
        </div>

        {/* Outcome indicator */}
        {outcome && (
          <div className="mt-4 text-center">
            <span className={cn('text-sm font-medium', outcome.color)}>{outcome.text}</span>
          </div>
        )}

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
            {hasPrediction ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Save Prediction
              </span>
            ) : (
              'Set Your Score'
            )}
          </Button>
          {hasPrediction && <p className="text-xs text-center text-muted-foreground mt-2">Login required to save</p>}
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
