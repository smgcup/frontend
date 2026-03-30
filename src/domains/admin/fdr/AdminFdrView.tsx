'use client';

import type { Match } from '@/domains/matches/contracts';
import { useAdminFdr } from './hooks/useAdminFdr';
import AdminFdrViewUi from './AdminFdrViewUi';

type AdminFdrViewProps = {
  matches: Match[];
};

const AdminFdrView = ({ matches }: AdminFdrViewProps) => {
  const {
    rounds,
    filteredMatches,
    selectedRound,
    setSelectedRound,
    fdrState,
    handleFdrChange,
    handleSaveAll,
    saving,
    error,
    success,
    hasDirtyEntries,
  } = useAdminFdr(matches);

  return (
    <AdminFdrViewUi
      matches={filteredMatches}
      rounds={rounds}
      selectedRound={selectedRound}
      onRoundChange={setSelectedRound}
      fdrState={fdrState}
      onFdrChange={handleFdrChange}
      onSaveAll={handleSaveAll}
      saving={saving}
      error={error}
      success={success}
      hasDirtyEntries={hasDirtyEntries}
    />
  );
};

export default AdminFdrView;
