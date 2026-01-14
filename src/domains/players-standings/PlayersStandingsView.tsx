import type { PlayersPageData } from './contracts';
import PlayersStandingsViewUi from './PlayersStandingsViewUi';

type PlayersViewProps = {
  data: PlayersPageData;
};

const PlayersStandingsView = ({ data }: PlayersViewProps) => {
  return <PlayersStandingsViewUi data={data} />;
};

export default PlayersStandingsView;
