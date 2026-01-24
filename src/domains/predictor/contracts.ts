import type { Match } from '@/domains/matches/contracts';

export type ScorePrediction = {
  homeScore: number;
  awayScore: number;
};

export type Prediction = {
  id: string;
  matchId: string;
  match: Match;
  predictedHomeScore: number;
  predictedAwayScore: number;
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
