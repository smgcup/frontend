'use client';

import AdminMatchCreateViewUi from './AdminMatchCreateViewUi';
import { useAdminMatchCreate } from './hooks/useAdminMatchCreate';

const AdminMatchCreateView = () => {
  const { teams, teamsLoading, teamsError, externalErrors, submitError, onCreateMatch, createLoading } =
    useAdminMatchCreate();

  return (
    <AdminMatchCreateViewUi
      teams={teams}
      teamsLoading={teamsLoading}
      teamsError={teamsError}
      externalErrors={externalErrors}
      submitError={submitError}
      onCreateMatch={onCreateMatch}
      createLoading={createLoading}
    />
  );
};

export default AdminMatchCreateView;
