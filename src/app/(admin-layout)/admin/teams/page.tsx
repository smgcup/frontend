import AdminTeamsView from '@/domains/admin/teams/list/AdminTeamsView';
import { getAdminTeamsListPageData } from '@/domains/admin/teams/list/ssr/getAdminTeamsListPageData';

export default async function AdminTeamsPage() {
  const { teams, teamsErrorMessage } = await getAdminTeamsListPageData();

  if (teamsErrorMessage) {
    return <div>Error loading teams: {teamsErrorMessage}</div>;
  }

  return <AdminTeamsView initialTeams={teams} />;
}
