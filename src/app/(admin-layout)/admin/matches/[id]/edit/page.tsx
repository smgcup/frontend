import AdminMatchEditView from '@/domains/admin/matches/edit/AdminMatchEditView';

type AdminMatchEditPageProps = {
  params: Promise<{ id: string }>;
};

const AdminMatchEditPage = async ({ params }: AdminMatchEditPageProps) => {
  const { id } = await params;
  return <AdminMatchEditView matchId={id} />;
};

export default AdminMatchEditPage;

