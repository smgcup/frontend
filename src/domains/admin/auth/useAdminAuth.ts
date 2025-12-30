import { useMutation } from '@apollo/client/react';
import {
	AdminLoginDocument,
	AdminLoginMutation,
	AdminLoginMutationVariables,
} from '@/graphql/';
export const useAdminAuth = () => {
	// GraphQL Mutations

	const [
		adminLoginMutation,
		{ loading: adminLoginLoading, error: adminLoginError },
	] = useMutation<AdminLoginMutation, AdminLoginMutationVariables>(
		AdminLoginDocument
	);

	const handleAdminLogin = async (passkey: string) => {
		try {
			const { data } = await adminLoginMutation({
				variables: { passkey },
			});
			return data;
		} catch (error) {
			console.error(error);
		}
	};
	return {
		adminLoginLoading,
		adminLoginError: adminLoginError ?? null,
		onAdminLogin: handleAdminLogin,
	};
};
