import HomeViewUi from './HomeViewUi';
import { Team } from '@/domains/team/contracts';
import { News } from '../news/contracts';
import type { Match } from '../matches/contracts';
import type { Player } from '@/domains/player/contracts';
import type { HeroStatistics } from './contracts';

type HomeViewProps = {
  teams: Team[];
  news: News[];
  matches: Match[];
  heroStatistics: HeroStatistics;
  topPlayers: Player[];
};
const HomeView = ({ teams, news, matches, heroStatistics, topPlayers }: HomeViewProps) => {
  return (
    <HomeViewUi teams={teams} news={news} matches={matches} heroStatistics={heroStatistics} topPlayers={topPlayers} />
  );
};

export default HomeView;
