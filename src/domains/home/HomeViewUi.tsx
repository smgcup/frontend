import React from 'react';
import {
	HeroSection,
	UpcomingMatchesSection,
	TournamentStatistics,
	NewsSection,
} from './components';
import { Team } from '@/domains/team/contracts';
import { News as NewsType } from '../news/contracts';
type HomeViewUiProps = {
	teams: Team[];
	news: NewsType[];
};
const HomeViewUi = ({ teams, news }: HomeViewUiProps) => {
	return (
		<>
			<HeroSection />
			<UpcomingMatchesSection teams={teams} />
			<TournamentStatistics teams={teams} />
			<NewsSection news={news} />
		</>
	);
};

export default HomeViewUi;
