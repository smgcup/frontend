import type { PredictionLeaderboardQuery, MyPredictionStatsQuery } from '@/graphql';
import type { UserPredictionStats, LeaderboardEntry } from '../contracts';

type LeaderboardStatsFromQuery = PredictionLeaderboardQuery['predictionLeaderboard'][number];
type MyStatsFromQuery = MyPredictionStatsQuery['myPredictionStats'];

export const mapUserPredictionStats = (stats: LeaderboardStatsFromQuery | MyStatsFromQuery): UserPredictionStats => {
  return {
    id: stats.id,
    totalPoints: stats.totalPoints,
    exactMatchesCount: stats.exactMatchesCount,
    correctOutcomesCount: stats.correctOutcomesCount,
    totalPredictionsCount: stats.totalPredictionsCount,
    lastUpdated: stats.lastUpdated,
    user: {
      id: stats.user.id,
      username: stats.user.username,
      firstName: stats.user.firstName,
      lastName: stats.user.lastName,
    },
  };
};

export const mapLeaderboardEntry = (
  stats: LeaderboardStatsFromQuery,
  index: number,
): LeaderboardEntry => {
  const baseStats = mapUserPredictionStats(stats);
  const accuracy =
    stats.totalPredictionsCount > 0
      ? (stats.correctOutcomesCount / stats.totalPredictionsCount) * 100
      : 0;

  return {
    ...baseStats,
    rank: index + 1,
    accuracy: Math.round(accuracy),
  };
};
