'use client';

import AdminNewsEditViewUi from './AdminNewsEditViewUi';
import { useAdminNewsEdit } from './hooks/useAdminNewsEdit';

type AdminNewsEditViewProps = {
  newsId: string;
};

const AdminNewsEditView = ({ newsId }: AdminNewsEditViewProps) => {
  const { news, newsLoading, updateLoading, onUpdateNews } = useAdminNewsEdit(newsId);

  return (
    <AdminNewsEditViewUi
      news={news}
      newsLoading={newsLoading}
      updateLoading={updateLoading}
      onUpdateNews={onUpdateNews}
    />
  );
};

export default AdminNewsEditView;
