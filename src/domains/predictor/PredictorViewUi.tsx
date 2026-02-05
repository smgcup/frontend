'use client';

import { Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { predictorTheme } from '@/lib/gamemodeThemes';
import type { Match } from '@/domains/matches/contracts';
import { usePredictorView } from './hooks/usePredictorView';
import PredictionCard from './components/PredictionCard';
import ScoreRulesDialog from './components/ScoreRulesDialog';

type PredictorViewUiProps = {
  matches: Match[];
};

const PredictorViewUi = ({ matches }: PredictorViewUiProps) => {
  const {
    scoreRulesOpen,
    setScoreRulesOpen,
    matchErrors,
    isAuthenticated,
    predictions,
    allSavedPredictions,
    allExistingPredictionIds,
    predictableMatches,
    matchesByRound,
    predictedCount,
    handlePredictionChange,
    handleSave,
    submittingMatchId,
  } = usePredictorView({ matches });

  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-b from-primary/10 to-background">
        <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Score Predictor</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Predict the exact final score for each match. Exact predictions earn bonus points!
            </p>
          </div>

          {/* Scoring Info */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setScoreRulesOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-muted/50 backdrop-blur-sm px-6 py-2 border border-border text-sm font-medium transition hover:bg-muted/80"
            >
              View Score Rules
            </button>
          </div>
          <ScoreRulesDialog open={scoreRulesOpen} onOpenChange={setScoreRulesOpen} />
        </div>
      </div>

      {/* Matches Section */}
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className={cn('h-5 w-5', predictorTheme.iconAccent)} />
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            </div>
            <p className="text-muted-foreground">Predict the exact final score for each match before kickoff.</p>
          </div>
          {predictableMatches.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className={cn('font-semibold', predictorTheme.text)}>{predictedCount}</span> of{' '}
              <span className="font-semibold">{predictableMatches.length}</span> predicted
            </div>
          )}
        </div>

        {predictableMatches.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Upcoming Matches</h3>
            <p className="text-muted-foreground">Check back later for new matches to predict.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {matchesByRound.map(([round, roundMatches]) => (
              <section key={round}>
                <h3 className={cn('text-lg font-semibold mb-4 flex items-center gap-2', predictorTheme.text)}>
                  Round {round}
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {roundMatches.map((match) => (
                    <PredictionCard
                      key={match.id}
                      match={match}
                      prediction={predictions[match.id] ?? null}
                      savedPrediction={allSavedPredictions[match.id] ?? null}
                      existingPredictionId={allExistingPredictionIds[match.id]}
                      onPredictionChange={(prediction) => handlePredictionChange(match.id, prediction)}
                      onSave={isAuthenticated ? () => handleSave(match.id) : undefined}
                      isSaving={submittingMatchId === match.id}
                      error={matchErrors[match.id]}
                      isAuthenticated={isAuthenticated}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictorViewUi;
