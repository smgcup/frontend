'use client';

import AdminMatchesListViewUi from './AdminMatchesListViewUi';
import { useAdminMatchesList } from './hooks/useAdminMatchesList';
import type { Match } from '@/domains/matches/contracts';

type AdminMatchesListViewProps = {
  matches: Match[];
};

const AdminMatchesListView = ({ matches }: AdminMatchesListViewProps) => {
  const { deleteLoading, onDeleteMatch, startLoading, onStartMatch } = useAdminMatchesList();

  return (
    <AdminMatchesListViewUi
      matches={matches}
      deleteLoading={deleteLoading}
      onDeleteMatch={onDeleteMatch}
      startLoading={startLoading}
      onStartMatch={onStartMatch}
    />
  );
};

export default AdminMatchesListView;
