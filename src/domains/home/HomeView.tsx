import HomeViewUi from './HomeViewUi';
import { Team } from '@/domains/team/contracts';
import { News } from '../news/contracts';

type HomeViewProps = {
  teams: Team[];
  news: News[];
};
const HomeView = ({ teams, news }: HomeViewProps) => {
  return <HomeViewUi teams={teams} news={news} />;
};

export default HomeView;
