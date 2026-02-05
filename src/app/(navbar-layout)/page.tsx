import HomeView from '@/domains/home/HomeView';
import { getHomePageData } from '@/domains/home/ssr/getHomePageData';

// Avoid prerender at build time (API may be unavailable); render on request
export const dynamic = 'force-dynamic';

const page = async () => {
  const { teams, news, matches, heroStatistics, topPlayers } = await getHomePageData();
  return <HomeView teams={teams} news={news} matches={matches} heroStatistics={heroStatistics} topPlayers={topPlayers} />;
};

export default page;
