'use client';

import AdminMatchesListViewUi from './AdminMatchesListViewUi';
import { useAdminMatchesList } from './hooks/useAdminMatchesList';

const AdminMatchesListView = () => {
  const { matches, matchesLoading, matchesError, deleteLoading, onDeleteMatch } = useAdminMatchesList();

  return (
    <AdminMatchesListViewUi
      matches={matches}
      matchesLoading={matchesLoading}
      matchesError={matchesError}
      deleteLoading={deleteLoading}
      onDeleteMatch={onDeleteMatch}
    />
  );
};

export default AdminMatchesListView;
