'use client';
import AdminPlayerCreateViewUi from './AdminPlayerCreateViewUi';
import { useAdminPlayerCreate } from './hooks/useAdminPlayerCreate';
import type { PlayerTeam } from '@/domains/player/contracts';

type AdminPlayerCreateViewProps = {
  initialTeams: PlayerTeam[];
};

const AdminPlayerCreateView = ({ initialTeams }: AdminPlayerCreateViewProps) => {
  const { onAdminPlayerCreate, adminPlayerCreateLoading, adminPlayerCreateError } = useAdminPlayerCreate();

  return (
    <AdminPlayerCreateViewUi
      teams={initialTeams}
      teamsLoading={false}
      teamsError={null}
      onAdminPlayerCreate={onAdminPlayerCreate}
      adminPlayerCreateLoading={adminPlayerCreateLoading}
      adminPlayerCreateError={adminPlayerCreateError}
    />
  );
};

export default AdminPlayerCreateView;
