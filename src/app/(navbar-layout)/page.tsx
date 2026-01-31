import HomeView from '@/domains/home/HomeView';
import { getHomePageData } from '@/domains/home/ssr/getHomePageData';

const page = async () => {
  const { teams, news, matches, heroStatistics } = await getHomePageData();
  return <HomeView teams={teams} news={news} matches={matches} heroStatistics={heroStatistics} />;
};

export default page;
