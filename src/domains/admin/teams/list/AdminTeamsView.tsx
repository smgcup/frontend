'use client';

import AdminTeamsViewUi from './AdminTeamsViewUi';
import { useAdminTeamsList } from './hooks/useAdminTeamsList';
import type { TeamWithPlayers } from '@/domains/team/contracts';

type AdminTeamsViewProps = {
  initialTeams: TeamWithPlayers[];
};

const AdminTeamsView = ({ initialTeams }: AdminTeamsViewProps) => {
  const { teams, actionError, deletingTeamId, onDeleteTeam } = useAdminTeamsList(initialTeams);

  return (
    <AdminTeamsViewUi
      teams={teams}
      actionError={actionError}
      deletingTeamId={deletingTeamId}
      onDeleteTeam={onDeleteTeam}
    />
  );
};

export default AdminTeamsView;
