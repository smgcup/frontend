import AdminPlayersListView from '@/domains/admin/players/list/AdminPlayersListView';
import { getAdminPlayersListPageData } from '@/domains/admin/players/list/ssr/getAdminPlayersListPageData';

export default async function AdminPlayersPage() {
  const { teams, teamsErrorMessage } = await getAdminPlayersListPageData();

  if (teamsErrorMessage) {
    return <div>Error loading teams: {teamsErrorMessage}</div>;
  }

  return <AdminPlayersListView initialTeams={teams} />;
}
