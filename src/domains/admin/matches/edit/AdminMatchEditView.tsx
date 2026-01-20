'use client';

import AdminMatchEditViewUi from './AdminMatchEditViewUi';
import { useAdminMatchEdit } from './hooks/useAdminMatchEdit';

type AdminMatchEditViewProps = {
  matchId: string;
};

const AdminMatchEditView = ({ matchId }: AdminMatchEditViewProps) => {
  const { match, matchLoading, matchError, externalErrors, submitError, onUpdateMatch, updateLoading } =
    useAdminMatchEdit(matchId);

  return (
    <AdminMatchEditViewUi
      match={match}
      matchLoading={matchLoading}
      matchError={matchError}
      externalErrors={externalErrors}
      submitError={submitError}
      onUpdateMatch={onUpdateMatch}
      updateLoading={updateLoading}
    />
  );
};

export default AdminMatchEditView;
