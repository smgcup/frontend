import { useMutation } from '@apollo/client/react';
import {
  AdminCreatePlayerDocument,
  AdminCreatePlayerMutation,
  AdminCreatePlayerMutationVariables,
  CreatePlayerDto,
} from '@/graphql';
import { mapPlayerCreateToDto } from '../mappers/mapPlayerCreateToDto';
export const useAdminPlayerCreate = () => {
  const [adminCreatePlayerMutation, { loading: adminPlayerCreateLoading, error: adminPlayerCreateError }] = useMutation<
    AdminCreatePlayerMutation,
    AdminCreatePlayerMutationVariables
  >(AdminCreatePlayerDocument);

  const handleAdminPlayerCreate = async (createPlayer: CreatePlayerDto) => {
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
