'use client';

import AdminPlayerPricesViewUi from './AdminPlayerPricesViewUi';
import { useAdminPlayerPrices } from './hooks/useAdminPlayerPrices';
import type { PlayerPriceEntry } from './contracts';

type AdminPlayerPricesViewProps = {
  initialPlayers: PlayerPriceEntry[];
};

const AdminPlayerPricesView = ({ initialPlayers }: AdminPlayerPricesViewProps) => {
  const {
    filteredAndSortedPlayers,
    formState,
    savingPlayerId,
    errors,
    successes,
    isDirty,
    sortField,
    searchQuery,
    setSortField,
    setSearchQuery,
    updateField,
    onSave,
  } = useAdminPlayerPrices(initialPlayers);

  return (
    <AdminPlayerPricesViewUi
      players={filteredAndSortedPlayers}
      formState={formState}
      savingPlayerId={savingPlayerId}
      errors={errors}
      successes={successes}
      isDirty={isDirty}
      sortField={sortField}
      searchQuery={searchQuery}
      onSortFieldChange={setSortField}
      onSearchChange={setSearchQuery}
      onUpdateField={updateField}
      onSave={onSave}
    />
  );
};

export default AdminPlayerPricesView;
