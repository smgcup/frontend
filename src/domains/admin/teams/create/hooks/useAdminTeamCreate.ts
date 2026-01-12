import { useMutation } from '@apollo/client/react';
import {
  AdminCreateTeamDocument,
  AdminCreateTeamMutation,
  AdminCreateTeamMutationVariables,
} from '@/graphql';
import type { TeamCreate } from '@/domains/team/contracts';
import { mapTeamCreateToDto } from '@/domains/team/mappers/mapTeamDto';
export const useAdminTeamCreate = () => {
  // GraphQL Mutations
  const [adminCreateTeamMutation, { loading: adminCreateTeamLoading, error: adminCreateTeamError }] = useMutation<
    AdminCreateTeamMutation,
    AdminCreateTeamMutationVariables
  >(AdminCreateTeamDocument);

  const handleAdminCreateTeam = async (createTeam: TeamCreate) => {
    const { data } = await adminCreateTeamMutation({
      variables: {
        createTeamDto: mapTeamCreateToDto(createTeam),
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
