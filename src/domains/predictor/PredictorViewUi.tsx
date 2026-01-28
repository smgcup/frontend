'use client';

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Trophy, Clock } from 'lucide-react';
import type { Match } from '@/domains/matches/contracts';
import type { ScorePrediction } from '@/domains/predictor/contracts';
import { MatchStatus, MyPredictionsDocument, type MyPredictionsQuery } from '@/graphql';
import { useAuth } from '@/contexts/AuthContext';
import { usePrediction } from './hooks/usePrediction';
import PredictionCard from './components/PredictionCard';
import ScoreRulesDialog from './components/ScoreRulesDialog';

type PredictorViewUiProps = {
  matches: Match[];
};

type ExistingPrediction = {
  id: string;
  matchId: string;
  predictedScore1: number;
  predictedScore2: number;
};

const PredictorViewUi = ({ matches }: PredictorViewUiProps) => {
  const [localPredictions, setLocalPredictions] = useState<Record<string, ScorePrediction>>({});
  const [savedPredictionIds, setSavedPredictionIds] = useState<Record<string, string>>({});
  const [scoreRulesOpen, setScoreRulesOpen] = useState(false);
  const [matchErrors, setMatchErrors] = useState<Record<string, string | null>>({});

  const { isAuthenticated } = useAuth();
  const { savePrediction, submittingMatchId, errorMessage, clearError } = usePrediction();

  // Fetch user's existing predictions (only if authenticated)
  const { data: myPredictionsData } = useQuery<MyPredictionsQuery>(MyPredictionsDocument, {
    skip: !isAuthenticated,
    fetchPolicy: 'cache-and-network',
  });

  // Derive existing predictions from query data
  const existingPredictions = useMemo<Record<string, ExistingPrediction>>(() => {
    if (!myPredictionsData?.myPredictions) return {};

    const result: Record<string, ExistingPrediction> = {};
    myPredictionsData.myPredictions.forEach((pred) => {
      result[pred.match.id] = {
        id: pred.id,
        matchId: pred.match.id,
        predictedScore1: pred.predictedScore1 ?? 0,
        predictedScore2: pred.predictedScore2 ?? 0,
      };
    });
    return result;
  }, [myPredictionsData]);

  // Derive score predictions from server data
  const serverPredictions = useMemo<Record<string, ScorePrediction>>(() => {
    if (!myPredictionsData?.myPredictions) return {};

    const result: Record<string, ScorePrediction> = {};
    myPredictionsData.myPredictions.forEach((pred) => {
      result[pred.match.id] = {
        predictedScore1: pred.predictedScore1 ?? 0,
        predictedScore2: pred.predictedScore2 ?? 0,
      };
    });
    return result;
  }, [myPredictionsData]);

  // Merge server and local predictions (local takes precedence for edited values)
  const predictions = useMemo(() => {
    return { ...serverPredictions, ...localPredictions };
  }, [serverPredictions, localPredictions]);

  // Merge server IDs with newly saved IDs
  const allExistingPredictionIds = useMemo(() => {
    const serverIds: Record<string, string> = {};
    Object.entries(existingPredictions).forEach(([matchId, pred]) => {
      serverIds[matchId] = pred.id;
    });
    return { ...serverIds, ...savedPredictionIds };
  }, [existingPredictions, savedPredictionIds]);

  // Filter to only show scheduled matches that can be predicted
  const predictableMatches = matches.filter((match) => match.status === MatchStatus.Scheduled);

  const handlePredictionChange = useCallback((matchId: string, prediction: ScorePrediction) => {
    setLocalPredictions((prev) => ({
      ...prev,
      [matchId]: prediction,
    }));
    // Clear any error for this match when prediction changes
    setMatchErrors((prev) => ({ ...prev, [matchId]: null }));
  }, []);

  const handleSave = useCallback(
    async (matchId: string) => {
      const prediction = predictions[matchId];
      if (!prediction) return;

      clearError();
      const existingId = allExistingPredictionIds[matchId];

      const savedId = await savePrediction(matchId, prediction.predictedScore1, prediction.predictedScore2, existingId);

      if (savedId) {
        // Store the new prediction ID for updates
        setSavedPredictionIds((prev) => ({
          ...prev,
          [matchId]: savedId,
        }));
        // Clear error for this match on success
        setMatchErrors((prev) => ({ ...prev, [matchId]: null }));
      } else if (errorMessage) {
        // Set error for this specific match
        setMatchErrors((prev) => ({ ...prev, [matchId]: errorMessage }));
      }
    },
    [predictions, allExistingPredictionIds, savePrediction, clearError, errorMessage],
  );

  // Count predictions (including existing ones from the server)
  const predictedCount = Object.keys(predictions).length;

  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-primary/5">
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
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            </div>
            <p className="text-muted-foreground">Predict the exact final score for each match before kickoff.</p>
          </div>
          {predictableMatches.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-orange-500">{predictedCount}</span> of{' '}
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {predictableMatches.map((match) => (
              <PredictionCard
                key={match.id}
                match={match}
                prediction={predictions[match.id] ?? null}
                savedPrediction={serverPredictions[match.id] ?? null}
                existingPredictionId={allExistingPredictionIds[match.id]}
                onPredictionChange={(prediction) => handlePredictionChange(match.id, prediction)}
                onSave={isAuthenticated ? () => handleSave(match.id) : undefined}
                isSaving={submittingMatchId === match.id}
                error={matchErrors[match.id]}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictorViewUi;
