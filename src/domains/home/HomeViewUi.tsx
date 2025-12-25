import React from 'react';
import {
	HeroSection,
	UpcomingMatchesSection,
	TournamentStatistics,
	News,
} from './components';
const HomeViewUi = () => {
	return (
		<>
			<HeroSection />
			<UpcomingMatchesSection />
			<TournamentStatistics />
			<News />
		</>
	);
};

export default HomeViewUi;
