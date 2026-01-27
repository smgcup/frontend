import { getClient } from '@/lib/initializeApollo';
import {
  PredictionLeaderboardDocument,
  type PredictionLeaderboardQuery,
  type PredictionLeaderboardQueryVariables,
} from '@/graphql';
import { mapLeaderboardEntry } from '../mappers/mapUserPredictionStats';

export const getLeaderboardPageData = async () => {
  const client = await getClient();

  const { data, error } = await client.query<PredictionLeaderboardQuery, PredictionLeaderboardQueryVariables>({
    query: PredictionLeaderboardDocument,
  });

  const leaderboard = data?.predictionLeaderboard.map((entry, index) => mapLeaderboardEntry(entry, index)) ?? [];

  return { leaderboard, error };
};
