import { useMutation } from '@apollo/client/react';
import {
  AdminCreatePlayerDocument,
  AdminCreatePlayerMutation,
  AdminCreatePlayerMutationVariables,
  CreatePlayerDto,
} from '@/graphql';
export const useAdminPlayerCreate = () => {
  const [adminCreatePlayerMutation, { loading: adminPlayerCreateLoading, error: adminPlayerCreateError }] = useMutation<
    AdminCreatePlayerMutation,
    AdminCreatePlayerMutationVariables
  >(AdminCreatePlayerDocument);

  const handleAdminPlayerCreate = async (createPlayerDto: CreatePlayerDto) => {
    await adminCreatePlayerMutation({
      variables: { createPlayerDto },
    });
  };
  return {
    adminPlayerCreateLoading,
    adminPlayerCreateError: adminPlayerCreateError ?? null,
    onAdminPlayerCreate: handleAdminPlayerCreate,
  };
};
