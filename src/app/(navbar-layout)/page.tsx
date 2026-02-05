import HomeView from '@/domains/home/HomeView';
import { getHomePageData } from '@/domains/home/ssr/getHomePageData';

// ISR: Revalidate every 10 minutes
export const revalidate = 10;

const HomePage = async () => {
  const { teams, news, matches, heroStatistics, topPlayers } = await getHomePageData();

  return (
    <HomeView teams={teams} news={news} matches={matches} heroStatistics={heroStatistics} topPlayers={topPlayers} />
  );
};

export default HomePage;
