import React from 'react';
import { HeroSection, UpcomingMatchesSection, TournamentStatistics, NewsSection } from './components';
import { Team } from '@/domains/team/contracts';
import { News as NewsType } from '../news/contracts';
type HomeViewUiProps = {
  teams: Team[];
  news: NewsType[];
};
const HomeViewUi = ({ teams, news }: HomeViewUiProps) => {
  return (
    <>
      <HeroSection teams={teams} news={news} />
      <UpcomingMatchesSection teams={teams} news={news} />
      <TournamentStatistics teams={teams} news={news} />
      <NewsSection news={news} />
    </>
  );
};

export default HomeViewUi;
