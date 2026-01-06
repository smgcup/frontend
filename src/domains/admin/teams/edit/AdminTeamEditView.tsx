'use client';

import AdminTeamEditViewUi from './AdminTeamEditViewUi';
import { useAdminTeamEdit } from './hooks/useAdminTeamEdit';

type AdminTeamEditViewProps = {
  teamId: string;
};

const AdminTeamEditView = ({ teamId }: AdminTeamEditViewProps) => {
  const {
    team,
    teamLoading,
    teamError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    onUpdateTeam,
    onDeleteTeam,
  } = useAdminTeamEdit(teamId);

  return (
    <AdminTeamEditViewUi
      team={team}
      teamLoading={teamLoading}
      teamError={teamError}
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


