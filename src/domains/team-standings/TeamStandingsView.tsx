import TeamStandingsViewUi from './TeamStandingsViewUi';
import { Team } from '@/domains/team/contracts';

const TeamStandingsView = ({ teams }: { teams: Team[] }) => {
  return <TeamStandingsViewUi teams={teams} />;
};

export default TeamStandingsView;