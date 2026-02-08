'use client';

import AdminPlayersListViewUi from './AdminPlayersListViewUi';
import { useAdminPlayersList } from './hooks/useAdminPlayersList';
import type { Team } from '@/domains/team/contracts';

type AdminPlayersListViewProps = {
  initialTeams: Team[];
};

const AdminPlayersListView = ({ initialTeams }: AdminPlayersListViewProps) => {
  const {
    teams,
    players,
    totalCount,
    searchQuery,
    setSearchQuery,
    selectedTeamId,
    setSelectedTeamId,
    actionError,
    deletingPlayerId,
    onDeletePlayer,
  } = useAdminPlayersList(initialTeams);

  return (
    <AdminPlayersListViewUi
      teams={teams}
      players={players}
      totalCount={totalCount}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedTeamId={selectedTeamId}
      onTeamChange={setSelectedTeamId}
      actionError={actionError}
      deletingPlayerId={deletingPlayerId}
      onDeletePlayer={onDeletePlayer}
    />
  );
};

export default AdminPlayersListView;
