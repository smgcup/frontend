'use client';

import AdminNewsCreateViewUi from './AdminNewsCreateViewUi';
import { useAdminNewsCreate } from './hooks/useAdminNewsCreate';

const AdminNewsCreateView = () => {
  const { createLoading, onCreateNews } = useAdminNewsCreate();

  return <AdminNewsCreateViewUi onCreateNews={onCreateNews} createLoading={createLoading} />;
};

export default AdminNewsCreateView;
