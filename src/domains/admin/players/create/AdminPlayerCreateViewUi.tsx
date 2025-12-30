import { CreatePlayerDto } from '@/graphql';
import { ErrorLike } from '@apollo/client';
import React from 'react';

type AdminPlayerCreateViewUiProps = {
	onAdminPlayerCreate: (createPlayerDto: CreatePlayerDto) => void;
	adminPlayerCreateLoading: boolean;
	adminPlayerCreateError: ErrorLike | null;
};
const AdminPlayerCreateViewUi = ({
	onAdminPlayerCreate,
	adminPlayerCreateLoading,
	adminPlayerCreateError,
}: AdminPlayerCreateViewUiProps) => {
	return (
		<div>
			<h1>Create Player</h1>
		</div>
	);
};
export default AdminPlayerCreateViewUi;
