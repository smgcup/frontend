import type { PlayersPageData } from './contracts';
import PlayersViewUi from './PlayersViewUi';

type PlayersViewProps = {
  data: PlayersPageData;
};

const PlayersView = ({ data }: PlayersViewProps) => {
  return <PlayersViewUi data={data} />;
};

export default PlayersView;
