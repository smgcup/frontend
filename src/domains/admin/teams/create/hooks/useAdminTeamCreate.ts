import { useMutation } from '@apollo/client/react';
import {
	AdminCreateTeamDocument,
	AdminCreateTeamMutation,
	AdminCreateTeamMutationVariables,
	CreateTeamDto,
} from '@/graphql';
export const useAdminTeamCreate = () => {
	// GraphQL Mutations
	const [
		adminCreateTeamMutation,
		{ loading: adminCreateTeamLoading, error: adminCreateTeamError },
	] = useMutation<AdminCreateTeamMutation, AdminCreateTeamMutationVariables>(
		AdminCreateTeamDocument
	);

	const handleAdminCreateTeam = async (createTeamDto: CreateTeamDto) => {
		const { data } = await adminCreateTeamMutation({
			variables: {
				createTeamDto,
			},
		});
		return data;
	};

	return {
		adminCreateTeamLoading,
		adminCreateTeamError,
		onAdminCreateTeam: handleAdminCreateTeam,
	};
};
