import React from 'react';
import { Button } from '@/components/ui/button';
import { ErrorLike } from '@apollo/client';
import { Input } from '@/components/ui/input';
type AdminAuthViewUiProps = {
	onAdminLogin: (passkey: string) => void;
	adminLoginLoading: boolean;
	adminLoginError: ErrorLike | null;
};
const AdminAuthViewUi = ({
	onAdminLogin,
	adminLoginLoading,
	adminLoginError,
}: AdminAuthViewUiProps) => {
	return (
		<div>
			<h1>Admin Auth</h1>
			<Input type="text" placeholder="Passkey" />
			<Button
				type="button"
				disabled={adminLoginLoading}
				onClick={() => onAdminLogin('123456789')}
			>
				Login
			</Button>
		</div>
	);
};

export default AdminAuthViewUi;
