'use client';

import AdminMatchEditViewUi from './AdminMatchEditViewUi';
import { useAdminMatchEdit } from './hooks/useAdminMatchEdit';

type AdminMatchEditViewProps = {
  matchId: string;
};

const AdminMatchEditView = ({ matchId }: AdminMatchEditViewProps) => {
  const {
    match,
    teams,
    matchLoading,
    updateLoading,
    matchError,
    teamsLoading,
    teamsError,
    externalErrors,
    submitError,
    onUpdateMatch,
  } = useAdminMatchEdit(matchId);

  return (
    <AdminMatchEditViewUi
      match={match}
      teams={teams}
      matchLoading={matchLoading}
      updateLoading={updateLoading}
      matchError={matchError}
      teamsLoading={teamsLoading}
      teamsError={teamsError}
      externalErrors={externalErrors}
      submitError={submitError}
      onUpdateMatch={onUpdateMatch}
    />
  );
};

export default AdminMatchEditView;
