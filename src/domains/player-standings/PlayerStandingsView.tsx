'use client';

import PlayerStandingsViewUi from './PlayerStandingsViewUi';
import { usePlayerStandings } from './hooks/usePlayerStandings';

const PlayerStandingsView = () => {
  const data = usePlayerStandings();

  return <PlayerStandingsViewUi data={data} />;
};

export default PlayerStandingsView;
