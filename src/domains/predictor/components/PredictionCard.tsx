'use client';

import { Calendar, Clock, Minus, Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Match } from '@/domains/matches/contracts';
import type { ScorePrediction } from '@/domains/predictor/contracts';
import { Button } from '@/components/ui/button';

type PredictionCardProps = {
  match: Match;
  prediction: ScorePrediction | null;
  savedPrediction?: ScorePrediction | null;
  existingPredictionId?: string;
  onPredictionChange: (prediction: ScorePrediction) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  error?: string | null;
  isAuthenticated?: boolean;
};

const PredictionCard = ({
  match,
  prediction,
  savedPrediction,
  existingPredictionId,
  onPredictionChange,
  onSave,
  isSaving,
  error,
  isAuthenticated,
}: PredictionCardProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '-';
    }
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateString));
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) {
      return '-';
    }
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const predictedScore1 = prediction?.predictedScore1 ?? 0;
  const predictedScore2 = prediction?.predictedScore2 ?? 0;
  const hasPrediction = prediction !== null;

  // Check if prediction has changed from saved values
  const hasChanges =
    hasPrediction &&
    (!savedPrediction ||
      prediction.predictedScore1 !== savedPrediction.predictedScore1 ||
      prediction.predictedScore2 !== savedPrediction.predictedScore2);

  const updateScore = (team: 'home' | 'away', delta: number) => {
    const currentScore1 = prediction?.predictedScore1 ?? 0;
    const currentScore2 = prediction?.predictedScore2 ?? 0;

    if (team === 'home') {
      const newScore = Math.max(0, Math.min(20, currentScore1 + delta));
      onPredictionChange({ predictedScore1: newScore, predictedScore2: currentScore2 });
    } else {
      const newScore = Math.max(0, Math.min(20, currentScore2 + delta));
      onPredictionChange({ predictedScore1: currentScore1, predictedScore2: newScore });
    }
  };

  const getOutcomeLabel = () => {
    if (!hasPrediction) return null;
    if (predictedScore1 > predictedScore2)
      return { text: `${match.firstOpponent.name} wins`, color: 'text-orange-500' };
    if (predictedScore2 > predictedScore1)
      return { text: `${match.secondOpponent.name} wins`, color: 'text-orange-500' };
    return { text: 'Draw', color: 'text-muted-foreground' };
  };

  const outcome = getOutcomeLabel();

  const handleSave = async () => {
    if (onSave) {
      await onSave();
      // TODO: Add toast notification for successful save
    }
  };

  const getButtonText = () => {
    if (isSaving) {
      return (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </span>
      );
    }
    if (existingPredictionId && hasChanges) {
      return (
        <span className="flex items-center gap-2">
          <Check className="h-4 w-4" />
          Update Prediction
        </span>
      );
    }
    return (
      <span className="flex items-center gap-2">
        <Check className="h-4 w-4" />
        Save Prediction
      </span>
    );
  };

  const canSave = hasChanges && onSave && !isSaving;
  const showLoginHint = hasPrediction && !isAuthenticated && !onSave;

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
                'font-bold text-2xl leading-tight transition-colors',
                hasPrediction && predictedScore1 > predictedScore2 && 'text-orange-500',
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
              disabled={isSaving}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase home score"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-xl text-2xl font-bold transition-all',
                hasPrediction && predictedScore1 > predictedScore2
                  ? 'bg-orange-500 text-white'
                  : 'bg-muted/50 border-2 border-border',
              )}
            >
              {predictedScore1}
            </div>
            <button
              type="button"
              onClick={() => updateScore('home', -1)}
              disabled={isSaving || predictedScore1 <= 0}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease home score"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {/* VS Divider */}
          <div className="px-2">
            <span className="text-lg font-semibold text-muted-foreground">VS</span>
          </div>

          {/* Away Score Control */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={() => updateScore('away', 1)}
              disabled={isSaving}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase away score"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div
              className={cn(
                'w-12 h-12 flex items-center justify-center rounded-xl text-2xl font-bold transition-all',
                hasPrediction && predictedScore2 > predictedScore1
                  ? 'bg-orange-500 text-white'
                  : 'bg-muted/50 border-2 border-border',
              )}
            >
              {predictedScore2}
            </div>
            <button
              type="button"
              onClick={() => updateScore('away', -1)}
              disabled={isSaving || predictedScore2 <= 0}
              className="p-1.5 rounded-lg bg-muted hover:bg-orange-500/20 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease away score"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>

          {/* Away Team */}
          <div className="flex-1 text-center">
            <div
              className={cn(
                'font-bold text-2xl leading-tight transition-colors',
                hasPrediction && predictedScore2 > predictedScore1 && 'text-orange-500',
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
              canSave
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
            disabled={!canSave}
            onClick={handleSave}
          >
            {hasPrediction ? getButtonText() : 'Set Your Score'}
          </Button>
          {showLoginHint && <p className="text-xs text-center text-muted-foreground mt-2">Login required to save</p>}
          {error && <p className="text-sm text-center text-destructive mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default PredictionCard;
