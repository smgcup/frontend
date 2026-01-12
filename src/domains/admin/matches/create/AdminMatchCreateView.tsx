'use client';

import AdminMatchCreateViewUi from './AdminMatchCreateViewUi';
import { useAdminMatchCreate } from './hooks/useAdminMatchCreate';
import { Team } from '@/domains/team/contracts';

type AdminMatchCreateViewProps = {
  teams: Team[];
};

const AdminMatchCreateView = ({ teams }: AdminMatchCreateViewProps) => {
  const { externalErrors, submitError, onCreateMatch, createLoading } = useAdminMatchCreate();

  return (
    <AdminMatchCreateViewUi
      teams={teams}
      externalErrors={externalErrors}
      submitError={submitError}
      onCreateMatch={onCreateMatch}
      createLoading={createLoading}
    />
  );
};

export default AdminMatchCreateView;
