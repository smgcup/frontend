import type { Match } from '@/domains/matches/contracts';
import type { Team } from '@/domains/team/contracts';

export type Prediction = {
  id: string;
  matchId: string;
  match: Match;
  predictedWinner: Team | 'draw';
  createdAt: string;
  isCorrect?: boolean;
  pointsEarned?: number;
};

export type PredictableMatch = Match & {
  canPredict: boolean;
  userPrediction?: Prediction;
  deadline: string;
};
