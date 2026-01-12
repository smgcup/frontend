import AdminMatchesListView from '@/domains/admin/matches/list/AdminMatchesListView';
import { getAdminMatchesListPageData } from '@/domains/admin/matches/list/ssr/getAdminMatchesListPageData';

const AdminMatchesPage = async () => {
  const { matches, errorMessage } = await getAdminMatchesListPageData();
  if (errorMessage) {
    return <div>Error loading matches: {errorMessage}</div>;
  }
  return <AdminMatchesListView matches={matches} />;
};

export default AdminMatchesPage;
