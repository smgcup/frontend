'use client';

import { useMutation } from '@apollo/client/react';
import {
  DeleteTeamDocument,
  DeleteTeamMutation,
  DeleteTeamMutationVariables,
  UpdateTeamDocument,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
  UpdateTeamDto,
} from '@/graphql';

export const useAdminTeamEdit = (teamId: string) => {
  const [updateTeamMutation, { loading: updateLoading, error: updateError }] = useMutation<
    UpdateTeamMutation,
    UpdateTeamMutationVariables
  >(UpdateTeamDocument);

  const [deleteTeamMutation, { loading: deleteLoading, error: deleteError }] = useMutation<
    DeleteTeamMutation,
    DeleteTeamMutationVariables
  >(DeleteTeamDocument);

  const handleUpdateTeam = async (dto: UpdateTeamDto) => {
    return await updateTeamMutation({
      variables: { id: teamId, dto },
    });
  };

  const handleDeleteTeam = async () => {
    return await deleteTeamMutation({
      variables: { id: teamId },
    });
  };

  return {
    updateLoading,
    updateError: updateError ?? null,
    deleteLoading,
    deleteError: deleteError ?? null,
    onUpdateTeam: handleUpdateTeam,
    onDeleteTeam: handleDeleteTeam,
  };
};
