'use client';

import React from 'react';
import AdminAuthViewUi from './AdminAuthViewUi';
import { useAdminAuth } from './useAdminAuth';

const AdminAuthView = () => {
  const { onAdminLogin, adminLoginLoading, adminLoginError } = useAdminAuth();

  // const handleAdminLogin = async (passkey: string) => {
  // 	const data = await onAdminLogin(passkey);
  // 	console.log(data);
  // };

  return (
    <AdminAuthViewUi
      onAdminLogin={onAdminLogin}
      adminLoginLoading={adminLoginLoading}
      adminLoginError={adminLoginError}
    />
  );
};

export default AdminAuthView;
