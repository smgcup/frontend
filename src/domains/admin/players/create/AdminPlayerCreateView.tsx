'use client';
import AdminPlayerCreateViewUi from './AdminPlayerCreateViewUi';
import { useAdminPlayerCreate } from './hooks/useAdminPlayerCreate';
import type { Team } from '@/domains/team/contracts';

type AdminPlayerCreateViewProps = {
  initialTeams: Team[];
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
