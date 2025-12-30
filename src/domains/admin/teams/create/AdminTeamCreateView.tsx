'use client';

import React from 'react';
import AdminTeamCreateViewUi from './AdminTeamCreateViewUi';
import { useAdminTeamCreate } from './hooks/useAdminTeamCreate';

const AdminTeamCreateView = () => {
	const { onAdminCreateTeam, adminCreateTeamLoading, adminCreateTeamError } =
		useAdminTeamCreate();
	return (
		<AdminTeamCreateViewUi
			onAdminCreateTeam={onAdminCreateTeam}
			adminCreateTeamLoading={adminCreateTeamLoading}
		/>
	);
};

export default AdminTeamCreateView;
