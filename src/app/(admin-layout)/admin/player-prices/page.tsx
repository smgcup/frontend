import AdminPlayerPricesView from '@/domains/admin/player-prices/AdminPlayerPricesView';
import { getAdminPlayerPricesPageData } from '@/domains/admin/player-prices/ssr/getAdminPlayerPricesPageData';

export default async function AdminPlayerPricesPage() {
  const { players, errorMessage } = await getAdminPlayerPricesPageData();

  if (errorMessage) {
    return <div>Error loading player prices: {errorMessage}</div>;
  }

  return <AdminPlayerPricesView initialPlayers={players} />;
}
