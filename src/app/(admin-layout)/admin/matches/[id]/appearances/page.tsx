import AdminMatchAppearancesView from '@/domains/admin/matches/appearances/AdminMatchAppearancesView';
import { getAdminMatchAppearancesPageData } from '@/domains/admin/matches/appearances/ssr/getAdminMatchAppearancesPageData';

type AdminMatchAppearancesPageProps = {
  params: Promise<{ id: string }>;
};

const AdminMatchAppearancesPage = async ({ params }: AdminMatchAppearancesPageProps) => {
  const { id } = await params;
  const { match, existingAppearances, errorMessage } = await getAdminMatchAppearancesPageData(id);

  if (errorMessage) {
    return <div>Error loading match: {errorMessage}</div>;
  }

  if (!match) {
    return <div>Match not found</div>;
  }

  return <AdminMatchAppearancesView match={match} existingAppearances={existingAppearances} />;
};

export default AdminMatchAppearancesPage;
