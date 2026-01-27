import type { Match } from '@/domains/matches/contracts';

export type ScorePrediction = {
  predictedScore1: number;
  predictedScore2: number;
};

export type Prediction = {
  id: string;
  matchId: string;
  match: Match;
  predictedScore1: number;
  predictedScore2: number;
  createdAt: string;
  isExactCorrect?: boolean;
  isOutcomeCorrect?: boolean;
  pointsEarned?: number;
};

export type PredictableMatch = Match & {
  canPredict: boolean;
  userPrediction?: Prediction;
  deadline: string;
};
