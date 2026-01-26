import PlayerViewUi from './PlayerViewUi';
import type { Player } from './contracts';

const PlayerView = ({ player }: { player: Player }) => {
  return <PlayerViewUi player={player} />;
};

export default PlayerView;
