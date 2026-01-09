import { useMutation } from '@apollo/client/react';
import { AdminCreatePlayerDocument, AdminCreatePlayerMutation, AdminCreatePlayerMutationVariables } from '@/graphql';
import type { PlayerCreate } from '@/domains/player/contracts';
import { mapPlayerCreateToDto } from '@/domains/player/mappers/mapPlayerCreateToDto';

export const useAdminPlayerCreate = () => {
  const [adminCreatePlayerMutation, { loading: adminPlayerCreateLoading, error: adminPlayerCreateError }] = useMutation<
    AdminCreatePlayerMutation,
    AdminCreatePlayerMutationVariables
  >(AdminCreatePlayerDocument);

  const handleAdminPlayerCreate = async (createPlayer: PlayerCreate) => {
    await adminCreatePlayerMutation({
      variables: { createPlayerDto: mapPlayerCreateToDto(createPlayer) },
    });
  };
  return {
    adminPlayerCreateLoading,
    adminPlayerCreateError: adminPlayerCreateError ?? null,
    onAdminPlayerCreate: handleAdminPlayerCreate,
  };
};
