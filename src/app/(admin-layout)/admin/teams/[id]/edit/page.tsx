import AdminTeamEditView from '@/domains/admin/teams/edit/AdminTeamEditView';
import { getAdminTeamEditPageData } from '@/domains/admin/teams/edit/ssr/getAdminTeamEditPageData';

type AdminTeamEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminTeamEditPage({ params }: AdminTeamEditPageProps) {
  const { id } = await params;
  const { team, teamErrorMessage } = await getAdminTeamEditPageData(id);

  if (teamErrorMessage) {
    return <div>Error loading team: {teamErrorMessage}</div>;
  }
  if (!team) {
    return <div>Team not found</div>;
  }

  return <AdminTeamEditView teamId={id} initialTeam={team} />;
}
