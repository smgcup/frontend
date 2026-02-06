'use client';

import PlayerStandingsViewUi from './PlayerStandingsViewUi';
import { usePlayerStandings } from './hooks/usePlayerStandings';
import type { StandingsCategory } from './contracts';

type Props = {
  initialStandings: StandingsCategory[];
};

const PlayerStandingsView = ({ initialStandings }: Props) => {
  const data = usePlayerStandings(initialStandings);

  return <PlayerStandingsViewUi data={data} />;
};

export default PlayerStandingsView;
