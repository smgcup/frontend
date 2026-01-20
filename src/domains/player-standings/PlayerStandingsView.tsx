import type { PlayersPageData } from './contracts';
import PlayerStandingsViewUi from './PlayerStandingsViewUi';

type PlayersViewProps = {
  data: PlayersPageData;
};

const PlayerStandingsView = ({ data }: PlayersViewProps) => {
  return <PlayerStandingsViewUi data={data} />;
};

export default PlayerStandingsView;
