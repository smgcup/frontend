import AdminMatchEditView from '@/domains/admin/matches/edit/AdminMatchEditView';
import { getAdminMatchEditPageData } from '@/domains/admin/matches/edit/ssr/getAdminMatchEditPageData';

type AdminMatchEditPageProps = {
  params: Promise<{ id: string }>;
};

const AdminMatchEditPage = async ({ params }: AdminMatchEditPageProps) => {
  const { id } = await params;

  const { teams, errorMessage } = await getAdminMatchEditPageData();

  console.log('teams', teams);

  if (errorMessage) {
    return <div>Error loading teams: {errorMessage}</div>;
  }

  return <AdminMatchEditView matchId={id} teams={teams} />;
};

export default AdminMatchEditPage;
