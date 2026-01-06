'use client';

import AdminNewsListViewUi from './AdminNewsListViewUi';
import { useAdminNewsList } from './hooks/useAdminNewsList';

const AdminNewsListView = () => {
  const { news, newsLoading, newsError, deleteLoading, onDeleteNews } = useAdminNewsList();

  return (
    <AdminNewsListViewUi
      news={news}
      newsLoading={newsLoading}
      newsError={newsError}
      deleteLoading={deleteLoading}
      onDeleteNews={onDeleteNews}
    />
  );
};

export default AdminNewsListView;
