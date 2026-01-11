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
import type { PlayerUpdate } from '@/domains/player/contracts';

export const useAdminPlayerEdit = (playerId: string) => {
  const [updatePlayerMutation, { loading: updateLoading, error: updateError }] = useMutation<
    UpdatePlayerMutation,
    UpdatePlayerMutationVariables
  >(UpdatePlayerDocument);

  const [deletePlayerMutation, { loading: deleteLoading, error: deleteError }] = useMutation<
    DeletePlayerMutation,
    DeletePlayerMutationVariables
  >(DeletePlayerDocument);

  const handleUpdatePlayer = async (dto: PlayerUpdate) => {
    const gqlDto: UpdatePlayerDto = {};
    if (dto.firstName !== undefined) gqlDto.firstName = dto.firstName;
    if (dto.lastName !== undefined) gqlDto.lastName = dto.lastName;
    if (dto.teamId !== undefined) gqlDto.teamId = dto.teamId;
    if (dto.height !== undefined) gqlDto.height = dto.height;
    if (dto.weight !== undefined) gqlDto.weight = dto.weight;
    if (dto.yearOfBirth !== undefined) gqlDto.yearOfBirth = dto.yearOfBirth;
    if (dto.imageUrl !== undefined) gqlDto.imageUrl = dto.imageUrl;
    if (dto.position !== undefined) gqlDto.position = dto.position;
    if (dto.preferredFoot !== undefined) gqlDto.preferredFoot = dto.preferredFoot;

    return await updatePlayerMutation({
      variables: { id: playerId, dto: gqlDto },
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
