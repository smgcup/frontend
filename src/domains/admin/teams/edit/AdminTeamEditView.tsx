'use client';

import AdminTeamEditViewUi from './AdminTeamEditViewUi';
import { useAdminTeamEdit } from './hooks/useAdminTeamEdit';
import type { Team } from '@/domains/team/contracts';

type AdminTeamEditViewProps = {
  teamId: string;
  initialTeam: Team;
};

const AdminTeamEditView = ({ teamId, initialTeam }: AdminTeamEditViewProps) => {
  const { updateLoading, updateError, deleteLoading, deleteError, onUpdateTeam, onDeleteTeam } =
    useAdminTeamEdit(teamId);

  return (
    <AdminTeamEditViewUi
      team={initialTeam}
      updateLoading={updateLoading}
      updateError={updateError}
      deleteLoading={deleteLoading}
      deleteError={deleteError}
      onUpdateTeam={onUpdateTeam}
      onDeleteTeam={onDeleteTeam}
    />
  );
};

export default AdminTeamEditView;
