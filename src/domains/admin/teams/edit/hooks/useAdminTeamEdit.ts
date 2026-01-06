'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import {
  DeleteTeamDocument,
  DeleteTeamMutation,
  DeleteTeamMutationVariables,
  TeamByIdDocument,
  TeamByIdQuery,
  TeamByIdQueryVariables,
  UpdateTeamDocument,
  UpdateTeamDto,
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
} from '@/graphql';

export const useAdminTeamEdit = (teamId: string) => {
  const { data, loading: teamLoading, error: teamError } = useQuery<TeamByIdQuery, TeamByIdQueryVariables>(
    TeamByIdDocument,
    { variables: { id: teamId } },
  );

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
    team: data?.teamById,
    teamLoading,
    teamError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    onUpdateTeam: handleUpdateTeam,
    onDeleteTeam: handleDeleteTeam,
  };
};


