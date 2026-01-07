'use client';

import AdminPlayerEditViewUi from './AdminPlayerEditViewUi';
import { useAdminPlayerEdit } from './hooks/useAdminPlayerEdit';

type AdminPlayerEditViewProps = {
  playerId: string;
};

const AdminPlayerEditView = ({ playerId }: AdminPlayerEditViewProps) => {
  const {
    teams,
    teamsLoading,
    teamsError,
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
      teams={teams}
      teamsLoading={teamsLoading}
      teamsError={teamsError}
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


