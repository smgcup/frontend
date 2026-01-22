import HomeViewUi from './HomeViewUi';
import { Team } from '@/domains/team/contracts';
import { News } from '../news/contracts';
// import type { MatchListItem } from '@/domains/matches/contracts';
import type { Match } from '../matches/contracts';

type HomeViewProps = {
  teams: Team[];
  news: News[];
  matches: Match[];
};
const HomeView = ({ teams, news, matches }: HomeViewProps) => {
  return <HomeViewUi teams={teams} news={news} matches={matches} />;
};

export default HomeView;
