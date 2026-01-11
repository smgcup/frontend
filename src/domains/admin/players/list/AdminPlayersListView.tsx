'use client';

import AdminPlayersListViewUi from './AdminPlayersListViewUi';
import { useAdminPlayersList } from './hooks/useAdminPlayersList';
import type { TeamWithPlayers } from '@/domains/team/contracts';

type AdminPlayersListViewProps = {
  initialTeams: TeamWithPlayers[];
};

const AdminPlayersListView = ({ initialTeams }: AdminPlayersListViewProps) => {
  const currentYear = new Date().getFullYear();

  const { teams, players, actionError, deletingPlayerId, onDeletePlayer } = useAdminPlayersList(initialTeams);

  return (
    <AdminPlayersListViewUi
      teams={teams}
      players={players}
      currentYear={currentYear}
      actionError={actionError}
      deletingPlayerId={deletingPlayerId}
      onDeletePlayer={onDeletePlayer}
    />
  );
};

export default AdminPlayersListView;
