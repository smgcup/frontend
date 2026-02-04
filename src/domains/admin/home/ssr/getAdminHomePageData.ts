import { getClient } from '@/lib/initializeApollo';
import { GetAdminStatisticsDocument, GetAdminStatisticsQuery, GetAdminStatisticsQueryVariables } from '@/graphql';

export type AdminStatistics = {
  teamsCount: number;
  playersCount: number;
  matchesCount: number;
  newsCount: number;
};

export const getAdminHomePageData = async () => {
  const client = await getClient();

  const { data: statsData, error } = await client.query<GetAdminStatisticsQuery, GetAdminStatisticsQueryVariables>({
    query: GetAdminStatisticsDocument,
  });

  const statistics: AdminStatistics = statsData?.statistics
    ? {
        teamsCount: statsData.statistics.teamsCount,
        playersCount: statsData.statistics.playersCount,
        matchesCount: statsData.statistics.matchesCount,
        newsCount: statsData.statistics.newsCount,
      }
    : { teamsCount: 0, playersCount: 0, matchesCount: 0, newsCount: 0 };

  return { statistics, error };
};
