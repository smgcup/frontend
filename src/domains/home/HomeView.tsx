import HomeViewUi from './HomeViewUi';
import { Team } from '@/domains/team/contracts';

type HomeViewProps = {
	teams: Team[];
};
const HomeView = ({ teams }: HomeViewProps) => {
	return <HomeViewUi teams={teams} />;
};

export default HomeView;
