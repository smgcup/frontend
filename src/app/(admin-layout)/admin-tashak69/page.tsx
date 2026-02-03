import React from 'react';
import AdminHomeView from '@/domains/admin/home/AdminHomeView';
import { getAdminHomePageData } from '@/domains/admin/home/ssr/getAdminHomePageData';

const AdminPage = async () => {
  const { statistics } = await getAdminHomePageData();
  return <AdminHomeView statistics={statistics} />;
};

export default AdminPage;
