import HomeView from '@/domains/home/HomeView';
import { getHomePageData } from '@/domains/home/ssr/getHomePageData';

export const revalidate = 300;

const page = async () => {
  const { teams, news, matches, heroStatistics, topPlayers } = await getHomePageData();
  return (
    <HomeView teams={teams} news={news} matches={matches} heroStatistics={heroStatistics} topPlayers={topPlayers} />
  );
};

export default page;
