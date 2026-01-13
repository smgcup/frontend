'use client';

import AdminTeamsViewUi from './AdminTeamsViewUi';
import { useAdminTeamsList } from './hooks/useAdminTeamsList';
import type { Team } from '@/domains/team/contracts';

type AdminTeamsViewProps = {
  teams: Team[];
};

const AdminTeamsView = ({ teams }: AdminTeamsViewProps) => {
  const { actionError, deletingTeamId, onDeleteTeam } = useAdminTeamsList();

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
