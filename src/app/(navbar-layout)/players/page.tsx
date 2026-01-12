import PlayersView from '@/domains/players/PlayersView';
import { getPlayersPageData } from '@/domains/players/ssr/getPlayersPageData';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getPlayersPageData();

  return <PlayersView data={data} />;
}
