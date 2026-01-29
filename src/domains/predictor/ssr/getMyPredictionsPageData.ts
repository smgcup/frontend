import { getClient } from '@/lib/initializeApollo';
import {
  MyPredictionsDocument,
  MyPredictionStatsDocument,
  type MyPredictionsQuery,
  type MyPredictionsQueryVariables,
  type MyPredictionStatsQuery,
  type MyPredictionStatsQueryVariables,
} from '@/graphql';
import { mapPrediction } from '../mappers/mapPrediction';
import { mapUserPredictionStats } from '../mappers/mapUserPredictionStats';

const AUTH_ERROR_CODES = ['userNotAuthenticated', 'userTokenMissing', 'userTokenInvalid', 'userTokenExpired'];

export const getMyPredictionsPageData = async () => {
  const client = await getClient();

  try {
    const [predictionsResult, statsResult] = await Promise.all([
      client.query<MyPredictionsQuery, MyPredictionsQueryVariables>({
        query: MyPredictionsDocument,
      }),
      client.query<MyPredictionStatsQuery, MyPredictionStatsQueryVariables>({
        query: MyPredictionStatsDocument,
      }),
    ]);

    const predictions = predictionsResult.data?.myPredictions.map(mapPrediction) ?? [];
    const stats = statsResult.data ? mapUserPredictionStats(statsResult.data.myPredictionStats) : null;

    const error = predictionsResult.error?.message ?? statsResult.error?.message ?? null;

    return { predictions, stats, error, isAuthError: false };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check if this is an auth error
    const isAuthError = AUTH_ERROR_CODES.some((code) => errorMessage.includes(code));

    return {
      predictions: [],
      stats: null,
      error: errorMessage,
      isAuthError,
    };
  }
};
