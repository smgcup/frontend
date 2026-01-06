'use client';

import AdminPlayerEditViewUi from './AdminPlayerEditViewUi';
import { useAdminPlayerEdit } from './hooks/useAdminPlayerEdit';

type AdminPlayerEditViewProps = {
  playerId: string;
};

const AdminPlayerEditView = ({ playerId }: AdminPlayerEditViewProps) => {
  const {
    player,
    playerLoading,
    playerError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    onUpdatePlayer,
    onDeletePlayer,
  } = useAdminPlayerEdit(playerId);

  return (
    <AdminPlayerEditViewUi
      player={player}
      playerLoading={playerLoading}
      playerError={playerError}
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


