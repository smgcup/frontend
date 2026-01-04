'use client';

import AdminNewsListViewUi from './AdminNewsListViewUi';
import { useAdminNewsList } from './hooks/useAdminNewsList';

const AdminNewsListView = () => {
  const { news, newsLoading, deleteLoading, onDeleteNews } = useAdminNewsList();

  return (
    <AdminNewsListViewUi
      news={news}
      newsLoading={newsLoading}
      deleteLoading={deleteLoading}
      onDeleteNews={onDeleteNews}
    />
  );
};

export default AdminNewsListView;
