import PlayersStandingsView from '@/domains/players-standings/PlayersStandingsView';
import { getPlayersPageData } from '@/domains/players-standings/ssr/getPlayersPageData';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getPlayersPageData();

  return <PlayersStandingsView data={data} />;
}
