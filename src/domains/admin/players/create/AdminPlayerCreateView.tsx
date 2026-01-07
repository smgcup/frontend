'use client';
import AdminPlayerCreateViewUi from './AdminPlayerCreateViewUi';
import { useAdminPlayerCreate } from './hooks/useAdminPlayerCreate';
const AdminPlayerCreateView = () => {
  const { teams, teamsLoading, teamsError, onAdminPlayerCreate, adminPlayerCreateLoading, adminPlayerCreateError } =
    useAdminPlayerCreate();
  return (
    <AdminPlayerCreateViewUi
      teams={teams}
      teamsLoading={teamsLoading}
      teamsError={teamsError}
      onAdminPlayerCreate={onAdminPlayerCreate}
      adminPlayerCreateLoading={adminPlayerCreateLoading}
      adminPlayerCreateError={adminPlayerCreateError}
    />
  );
};

export default AdminPlayerCreateView;
