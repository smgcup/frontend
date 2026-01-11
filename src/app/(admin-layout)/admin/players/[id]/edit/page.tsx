import AdminPlayerEditView from '@/domains/admin/players/edit/AdminPlayerEditView';
import { getAdminPlayerEditPageData } from '@/domains/admin/players/edit/ssr/getAdminPlayerEditPageData';

type AdminPlayerEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminPlayerEditPage({ params }: AdminPlayerEditPageProps) {
  const { id } = await params;
  const { teams, player, teamsErrorMessage } = await getAdminPlayerEditPageData(id);

  if (teamsErrorMessage) {
    return <div>Error loading teams: {teamsErrorMessage}</div>;
  }

  return <AdminPlayerEditView playerId={id} initialTeams={teams} initialPlayer={player} />;
}
