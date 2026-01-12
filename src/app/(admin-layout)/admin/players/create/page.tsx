import AdminPlayerCreateView from '@/domains/admin/players/create/AdminPlayerCreateView';
import { getAdminPlayerCreatePageData } from '@/domains/admin/players/create/ssr/getAdminPlayerCreatePageData';

const AdminPlayerCreatePage = async () => {
  const { teams, teamsErrorMessage } = await getAdminPlayerCreatePageData();

  if (teamsErrorMessage) {
    return <div>Error loading teams: {teamsErrorMessage}</div>;
  }

  return <AdminPlayerCreateView initialTeams={teams} />;
};

export default AdminPlayerCreatePage;
