'use client';
import AdminPlayerCreateViewUi from './AdminPlayerCreateViewUi';
import { useAdminPlayerCreate } from './hooks/useAdminPlayerCreate';
const AdminPlayerCreateView = () => {
  const { onAdminPlayerCreate, adminPlayerCreateLoading, adminPlayerCreateError } = useAdminPlayerCreate();
  return (
    <AdminPlayerCreateViewUi
      onAdminPlayerCreate={onAdminPlayerCreate}
      adminPlayerCreateLoading={adminPlayerCreateLoading}
      adminPlayerCreateError={adminPlayerCreateError}
    />
  );
};

export default AdminPlayerCreateView;
