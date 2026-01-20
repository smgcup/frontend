import PlayerStandingsView from '@/domains/player-standings/PlayerStandingsView';
import { getPlayerPageData } from '@/domains/player-standings/ssr/getPlayerPageData';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getPlayerPageData();

  return <PlayerStandingsView data={data} />;
}
