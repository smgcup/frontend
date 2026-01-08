'use client';

import AdminMatchCreateViewUi from './AdminMatchCreateViewUi';
import { useAdminMatchCreate } from './hooks/useAdminMatchCreate';
import { Team } from '@/domains/team/contracts';

type AdminMatchCreateViewProps = {
  teams: Team[];
  teamsError?: string | null;
};

const AdminMatchCreateView = ({ teams, teamsError }: AdminMatchCreateViewProps) => {
  const {
    teams: hookTeams,
    teamsLoading,
    teamsError: hookTeamsError,
    externalErrors,
    submitError,
    onCreateMatch,
    createLoading,
  } = useAdminMatchCreate({ teams, teamsError });

  return (
    <AdminMatchCreateViewUi
      teams={hookTeams}
      teamsLoading={teamsLoading}
      teamsError={hookTeamsError}
      externalErrors={externalErrors}
      submitError={submitError}
      onCreateMatch={onCreateMatch}
      createLoading={createLoading}
    />
  );
};

export default AdminMatchCreateView;
