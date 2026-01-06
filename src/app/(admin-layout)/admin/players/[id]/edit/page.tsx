import AdminPlayerEditView from '@/domains/admin/players/edit/AdminPlayerEditView';

type AdminPlayerEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPlayerEditPage({ params }: AdminPlayerEditPageProps) {
  const { id } = await params;
  return <AdminPlayerEditView playerId={id} />;
}


