'use client';

import { useMutation } from '@apollo/client/react';
import {
  DeleteTeamDocument,
  DeleteTeamMutation,
  DeleteTeamMutationVariables,
  UpdateTeamDocument,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
} from '@/graphql';
import type { TeamUpdate } from '@/domains/team/contracts';
import { mapTeamUpdateToDto } from '@/domains/team/mappers/mapTeamDto';

export const useAdminTeamEdit = (teamId: string) => {
  const [updateTeamMutation, { loading: updateLoading, error: updateError }] = useMutation<
    UpdateTeamMutation,
    UpdateTeamMutationVariables
  >(UpdateTeamDocument);

  const [deleteTeamMutation, { loading: deleteLoading, error: deleteError }] = useMutation<
    DeleteTeamMutation,
    DeleteTeamMutationVariables
  >(DeleteTeamDocument);

  const handleUpdateTeam = async (dto: TeamUpdate) => {
    return await updateTeamMutation({
      variables: { id: teamId, dto: mapTeamUpdateToDto(dto) },
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
