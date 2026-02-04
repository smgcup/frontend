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
  updatedAt: string;
  isExactCorrect?: boolean;
  isOutcomeCorrect?: boolean;
  pointsEarned?: number;
};

export type UserPredictionStats = {
  id: string;
  totalPoints: number;
  exactMatchesCount: number;
  correctOutcomesCount: number;
  totalPredictionsCount: number;
  lastUpdated: string;
  user: { id: string; username: string; firstName: string; lastName: string };
};

export type LeaderboardEntry = UserPredictionStats & {
  rank: number;
  accuracy: number;
};
