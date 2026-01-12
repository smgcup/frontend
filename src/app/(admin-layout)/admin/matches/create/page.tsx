import AdminMatchCreateView from '@/domains/admin/matches/create/AdminMatchCreateView';
import { getAdminMatchCreatePageData } from '@/domains/admin/matches/create/ssr/getAdminMatchCreatePageData';

const AdminMatchCreatePage = async () => {
  const { teams, errorMessage } = await getAdminMatchCreatePageData();
  if (errorMessage) {
    return <div>Error loading teams: {errorMessage}</div>;
  }
  return <AdminMatchCreateView teams={teams} />;
};

export default AdminMatchCreatePage;
