'use client';

import { useMutation } from '@apollo/client/react';
import {
  DeletePlayerDocument,
  DeletePlayerMutation,
  DeletePlayerMutationVariables,
  UpdatePlayerDocument,
  UpdatePlayerMutation,
  UpdatePlayerMutationVariables,
  type UpdatePlayerDto,
} from '@/graphql';

export const useAdminPlayerEdit = (playerId: string) => {
  const [updatePlayerMutation, { loading: updateLoading, error: updateError }] = useMutation<
    UpdatePlayerMutation,
    UpdatePlayerMutationVariables
  >(UpdatePlayerDocument);

  const [deletePlayerMutation, { loading: deleteLoading, error: deleteError }] = useMutation<
    DeletePlayerMutation,
    DeletePlayerMutationVariables
  >(DeletePlayerDocument);

  const handleUpdatePlayer = async (dto: UpdatePlayerDto) => {
    return await updatePlayerMutation({
      variables: { id: playerId, dto },
    });
  };

  const handleDeletePlayer = async () => {
    return await deletePlayerMutation({
      variables: { id: playerId },
    });
  };

  return {
    updateLoading,
    updateError: updateError ?? null,
    deleteLoading,
    deleteError: deleteError ?? null,
    onUpdatePlayer: handleUpdatePlayer,
    onDeletePlayer: handleDeletePlayer,
  };
};
