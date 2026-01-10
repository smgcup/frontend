import { getPlayersPageData } from './ssr/getPlayersPageData';
import PlayersView from './PlayersView';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getPlayersPageData();

  return <PlayersView data={data} />;
}
