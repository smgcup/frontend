import {
  getTeamsData,
  getNewsData,
  getMatchesData,
  getHeroStatisticsData,
  getTopPlayersData,
} from '@/lib/cachedQueries';

export const getHomePageData = async () => {
  const [teams, news, matches, heroStatistics, topPlayers] = await Promise.all([
    getTeamsData(),
    getNewsData(),
    getMatchesData(),
    getHeroStatisticsData(),
    getTopPlayersData(),
  ]);
  return { teams, news, matches, heroStatistics, topPlayers };
};
