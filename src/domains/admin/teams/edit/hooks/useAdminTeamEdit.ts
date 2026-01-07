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
  UpdateTeamMutation,
  UpdateTeamMutationVariables,
} from '@/graphql';
import type { TeamUpdate } from '@/domains/team/contracts';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapTeamUpdateToDto } from '@/domains/team/mappers/mapTeamDto';

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
    team: data?.teamById ? mapTeam(data.teamById) : undefined,
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


