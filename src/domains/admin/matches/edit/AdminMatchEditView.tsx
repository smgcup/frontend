'use client';

import AdminMatchEditViewUi from './AdminMatchEditViewUi';
import { useAdminMatchEdit } from './hooks/useAdminMatchEdit';
import { Team } from '@/domains/team/contracts';

type AdminMatchEditViewProps = {
  matchId: string;
  teams: Team[];
};

const AdminMatchEditView = ({ matchId, teams }: AdminMatchEditViewProps) => {
  const { match, matchLoading, matchError, externalErrors, submitError, onUpdateMatch, updateLoading } =
    useAdminMatchEdit(matchId);

  return (
    <AdminMatchEditViewUi
      match={match}
      matchLoading={matchLoading}
      matchError={matchError}
      teams={teams}
      externalErrors={externalErrors}
      submitError={submitError}
      onUpdateMatch={onUpdateMatch}
      updateLoading={updateLoading}
    />
  );
};

export default AdminMatchEditView;
