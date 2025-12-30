import React from 'react';
import {
	HeroSection,
	UpcomingMatchesSection,
	TournamentStatistics,
	News,
} from './components';
import { Team } from '@/domains/team/contracts';
type HomeViewUiProps = {
	teams: Team[];
};
const HomeViewUi = ({ teams }: HomeViewUiProps) => {
	return (
		<>
			<HeroSection />
			<UpcomingMatchesSection teams={teams} />
			<TournamentStatistics teams={teams} />
			<News />
		</>
	);
};

export default HomeViewUi;
