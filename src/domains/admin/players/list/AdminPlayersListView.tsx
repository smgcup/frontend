'use client';

import AdminPlayersListViewUi from './AdminPlayersListViewUi';
import { useAdminPlayersList } from './hooks/useAdminPlayersList';

const AdminPlayersListView = () => {
  const currentYear = new Date().getFullYear();

  const { teams, players, loading, error, actionError, deletingPlayerId, onDeletePlayer } = useAdminPlayersList();

  return (
    <AdminPlayersListViewUi
      teams={teams}
      players={players}
      currentYear={currentYear}
      loading={loading}
      error={error}
      actionError={actionError}
      deletingPlayerId={deletingPlayerId}
      onDeletePlayer={onDeletePlayer}
    />
  );
};

export default AdminPlayersListView;
