import type { MyPredictionsQuery } from '@/graphql';
import { MatchStatus } from '@/graphql';
import type { Prediction } from '../contracts';

type PredictionFromQuery = MyPredictionsQuery['myPredictions'][number];

/**
 * Determines the outcome (win/loss/draw) from scores
 * Returns: 1 for first team wins, -1 for second team wins, 0 for draw
 */
const getOutcome = (score1: number, score2: number): number => {
  if (score1 > score2) return 1;
  if (score2 > score1) return -1;
  return 0;
};

export const mapPrediction = (prediction: PredictionFromQuery): Prediction => {
  const { match, predictedScore1, predictedScore2 } = prediction;
  const isMatchFinished = match.status === MatchStatus.Finished;

  // Compute correctness only for finished matches with actual scores
  let isExactCorrect: boolean | undefined;
  let isOutcomeCorrect: boolean | undefined;

  if (
    isMatchFinished &&
    match.score1 != null &&
    match.score2 != null &&
    predictedScore1 != null &&
    predictedScore2 != null
  ) {
    isExactCorrect = predictedScore1 === match.score1 && predictedScore2 === match.score2;
    isOutcomeCorrect = getOutcome(predictedScore1, predictedScore2) === getOutcome(match.score1, match.score2);
  }

  return {
    id: prediction.id,
    matchId: match.id,
    match: {
      id: match.id,
      firstOpponent: match.firstOpponent,
      secondOpponent: match.secondOpponent,
      date: match.date ?? undefined,
      status: match.status,
      score1: match.score1 ?? undefined,
      score2: match.score2 ?? undefined,
      round: match.round,
      location: match.location ?? undefined,
    },
    predictedScore1: predictedScore1 ?? 0,
    predictedScore2: predictedScore2 ?? 0,
    isBoosted: prediction.isBoosted,
    createdAt: prediction.createdAt,
    updatedAt: prediction.updatedAt,
    isExactCorrect,
    isOutcomeCorrect,
    pointsEarned: prediction.pointsEarned ?? undefined,
  };
};
