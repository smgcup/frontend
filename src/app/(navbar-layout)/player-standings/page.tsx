import PlayerStandingsView from '@/domains/player-standings/PlayerStandingsView';
import { getPlayerStandingsPageData } from '@/domains/player-standings/ssr/getPlayerPageData';

export const revalidate = 300;

export default async function Page() {
  const { standings } = await getPlayerStandingsPageData();

  return <PlayerStandingsView initialStandings={standings} />;
}
