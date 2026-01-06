import AdminTeamEditView from '@/domains/admin/teams/edit/AdminTeamEditView';

type AdminTeamEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTeamEditPage({ params }: AdminTeamEditPageProps) {
  const { id } = await params;
  return <AdminTeamEditView teamId={id} />;
}


