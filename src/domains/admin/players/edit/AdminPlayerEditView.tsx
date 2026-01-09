'use client';

import AdminPlayerEditViewUi from './AdminPlayerEditViewUi';
import { useAdminPlayerEdit } from './hooks/useAdminPlayerEdit';
import type { PlayerEdit, PlayerTeam } from '@/domains/player/contracts';

type AdminPlayerEditViewProps = {
  playerId: string;
  initialTeams: PlayerTeam[];
  initialPlayer?: PlayerEdit;
};

const AdminPlayerEditView = ({ playerId, initialTeams, initialPlayer }: AdminPlayerEditViewProps) => {
  const { updateLoading, updateError, deleteLoading, deleteError, onUpdatePlayer, onDeletePlayer } =
    useAdminPlayerEdit(playerId);

  return (
    <AdminPlayerEditViewUi
      teams={initialTeams}
      player={initialPlayer}
      updateLoading={updateLoading}
      updateError={updateError}
      deleteLoading={deleteLoading}
      deleteError={deleteError}
      onUpdatePlayer={onUpdatePlayer}
      onDeletePlayer={onDeletePlayer}
    />
  );
};

export default AdminPlayerEditView;
