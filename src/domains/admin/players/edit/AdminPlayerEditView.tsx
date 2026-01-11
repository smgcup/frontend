'use client';

import AdminPlayerEditViewUi from './AdminPlayerEditViewUi';
import { useAdminPlayerEdit } from './hooks/useAdminPlayerEdit';
import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';

type AdminPlayerEditViewProps = {
  playerId: string;
  initialTeams: Team[];
  initialPlayer?: Player;
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
