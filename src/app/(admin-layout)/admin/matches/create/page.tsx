import AdminMatchCreateView from '@/domains/admin/matches/create/AdminMatchCreateView';
import { getAdminMatchCreatePageData } from '@/domains/admin/matches/create/ssr/getAdminMatchCreatePageData';

const AdminMatchCreatePage = async () => {
  const { teams, errorMessage } = await getAdminMatchCreatePageData();
  return <AdminMatchCreateView teams={teams} teamsError={errorMessage} />;
};

export default AdminMatchCreatePage;
