'use client';

import AdminTeamsViewUi from './AdminTeamsViewUi';
import { useAdminTeamsList } from './hooks/useAdminTeamsList';

const AdminTeamsView = () => {
  const { teams, teamsLoading, teamsError } = useAdminTeamsList();

  return <AdminTeamsViewUi teams={teams} loading={teamsLoading} error={teamsError} />;
};

export default AdminTeamsView;
