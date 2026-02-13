import AdminFdrView from '@/domains/admin/fdr/AdminFdrView';
import { getAdminMatchesListPageData } from '@/domains/admin/matches/list/ssr/getAdminMatchesListPageData';

const AdminFdrPage = async () => {
  const { matches, errorMessage } = await getAdminMatchesListPageData();
  if (errorMessage) {
    return <div>Error loading matches: {errorMessage}</div>;
  }
  return <AdminFdrView matches={matches} />;
};

export default AdminFdrPage;
