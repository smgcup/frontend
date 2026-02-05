import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import type { Match } from '@/domains/matches/contracts';
import type { ScorePrediction } from '@/domains/predictor/contracts';
import { MatchStatus, MyPredictionsDocument, type MyPredictionsQuery } from '@/graphql';
import { useAuth } from '@/contexts/AuthContext';
import { usePrediction } from './usePrediction';

type ExistingPrediction = {
  id: string;
  matchId: string;
  predictedScore1: number;
  predictedScore2: number;
};

type SavedPrediction = {
  id: string;
  predictedScore1: number;
  predictedScore2: number;
};

type UsePredictorViewProps = {
  matches: Match[];
};

export const usePredictorView = ({ matches }: UsePredictorViewProps) => {
  const [localPredictions, setLocalPredictions] = useState<Record<string, ScorePrediction>>({});
  const [savedPredictions, setSavedPredictions] = useState<Record<string, SavedPrediction>>({});
  const [scoreRulesOpen, setScoreRulesOpen] = useState(false);
  const [matchErrors, setMatchErrors] = useState<Record<string, string | null>>({});
  const [selectedRound, setSelectedRound] = useState(1);
  const [boostedMatchId, setBoostedMatchId] = useState<string | null>(null);

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

  // Derive the boosted match ID from server data
  const serverBoostedMatchId = useMemo<string | null>(() => {
    if (!myPredictionsData?.myPredictions) return null;
    const boostedPrediction = myPredictionsData.myPredictions.find((pred) => pred.isBoosted);
    return boostedPrediction?.match.id ?? null;
  }, [myPredictionsData]);

  // Sync local boostedMatchId with server data when it loads
  useEffect(() => {
    if (serverBoostedMatchId !== null) {
      setBoostedMatchId(serverBoostedMatchId);
    }
  }, [serverBoostedMatchId]);

  // Merge server, locally saved, and edited predictions (local edits take precedence)
  const predictions = useMemo(() => {
    const merged: Record<string, ScorePrediction> = { ...serverPredictions };
    // Add locally saved predictions
    Object.entries(savedPredictions).forEach(([matchId, pred]) => {
      merged[matchId] = {
        predictedScore1: pred.predictedScore1,
        predictedScore2: pred.predictedScore2,
      };
    });
    // Local edits take highest precedence
    return { ...merged, ...localPredictions };
  }, [serverPredictions, savedPredictions, localPredictions]);

  // Merge server IDs with newly saved IDs
  const allExistingPredictionIds = useMemo(() => {
    const serverIds: Record<string, string> = {};
    Object.entries(existingPredictions).forEach(([matchId, pred]) => {
      serverIds[matchId] = pred.id;
    });
    const localIds: Record<string, string> = {};
    Object.entries(savedPredictions).forEach(([matchId, pred]) => {
      localIds[matchId] = pred.id;
    });
    return { ...serverIds, ...localIds };
  }, [existingPredictions, savedPredictions]);

  // Merge server saved predictions with locally saved predictions
  const allSavedPredictions = useMemo<Record<string, ScorePrediction>>(() => {
    const result: Record<string, ScorePrediction> = { ...serverPredictions };
    Object.entries(savedPredictions).forEach(([matchId, pred]) => {
      result[matchId] = {
        predictedScore1: pred.predictedScore1,
        predictedScore2: pred.predictedScore2,
      };
    });
    return result;
  }, [serverPredictions, savedPredictions]);

  // Filter to only show scheduled matches that can be predicted
  const predictableMatches = useMemo(
    () => matches.filter((match) => match.status === MatchStatus.Scheduled),
    [matches],
  );

  // Available rounds (1-4)
  const availableRounds = [1, 2, 3, 4];

  // Filter to only show matches for the selected round, sorted by date
  const filteredMatches = useMemo(() => {
    return predictableMatches
      .filter((match) => match.round === selectedRound)
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      });
  }, [predictableMatches, selectedRound]);

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
      const isBoosted = boostedMatchId === matchId;

      const savedId = await savePrediction(matchId, prediction.predictedScore1, prediction.predictedScore2, existingId, isBoosted);

      if (savedId) {
        // Store the saved prediction with ID and values
        setSavedPredictions((prev) => ({
          ...prev,
          [matchId]: {
            id: savedId,
            predictedScore1: prediction.predictedScore1,
            predictedScore2: prediction.predictedScore2,
          },
        }));
        // Clear local prediction so it reflects the saved state
        setLocalPredictions((prev) => {
          const updated = { ...prev };
          delete updated[matchId];
          return updated;
        });
        // Clear error for this match on success
        setMatchErrors((prev) => ({ ...prev, [matchId]: null }));
      } else if (errorMessage) {
        // Set error for this specific match
        setMatchErrors((prev) => ({ ...prev, [matchId]: errorMessage }));
      }
    },
    [predictions, allExistingPredictionIds, savePrediction, clearError, errorMessage, boostedMatchId],
  );

  // Count predictions (including existing ones from the server)
  const predictedCount = Object.keys(predictions).length;

  // Toggle booster for a match (only one match can be boosted at a time)
  const handleToggleBooster = useCallback((matchId: string) => {
    setBoostedMatchId((prev) => (prev === matchId ? null : matchId));
  }, []);

  return {
    // State
    scoreRulesOpen,
    setScoreRulesOpen,
    matchErrors,
    selectedRound,
    setSelectedRound,
    boostedMatchId,
    serverBoostedMatchId,

    // Auth
    isAuthenticated,

    // Derived data
    predictions,
    allSavedPredictions,
    allExistingPredictionIds,
    predictableMatches,
    filteredMatches,
    availableRounds,
    predictedCount,

    // Handlers
    handlePredictionChange,
    handleSave,
    handleToggleBooster,

    // Loading state
    submittingMatchId,
  };
};
