'use client';

import AdminMatchesListViewUi from './AdminMatchesListViewUi';
import { useAdminMatchesList } from './hooks/useAdminMatchesList';
import type { Match } from '@/domains/matches/contracts';

type AdminMatchesListViewProps = {
  matches: Match[];
};

const AdminMatchesListView = ({ matches }: AdminMatchesListViewProps) => {
  const {
    filteredMatches,
    totalCount,
    rounds,
    searchQuery,
    setSearchQuery,
    selectedRound,
    setSelectedRound,
    deleteLoading,
    onDeleteMatch,
    onStartMatch,
  } = useAdminMatchesList(matches);

  return (
    <AdminMatchesListViewUi
      matches={filteredMatches}
      totalCount={totalCount}
      rounds={rounds}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedRound={selectedRound}
      onRoundChange={setSelectedRound}
      deleteLoading={deleteLoading}
      onDeleteMatch={onDeleteMatch}
      onStartMatch={onStartMatch}
    />
  );
};

export default AdminMatchesListView;
