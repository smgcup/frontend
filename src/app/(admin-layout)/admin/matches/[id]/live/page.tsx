import AdminMatchLiveView from '@/domains/admin/matches/live/AdminMatchLiveView';

type AdminMatchLivePageProps = {
  params: Promise<{ id: string }>;
};

const AdminMatchLivePage = async ({ params }: AdminMatchLivePageProps) => {
  const { id } = await params;
  return <AdminMatchLiveView matchId={id} />;
};

export default AdminMatchLivePage;

