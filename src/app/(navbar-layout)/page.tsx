import HomeView from '@/domains/home/HomeView';
import { getHomePageData } from '@/domains/home/ssr/getHomePageData';

const page = async () => {
  const { teams, news, error } = await getHomePageData();
  return <HomeView teams={teams} news={news} />;
};

export default page;
