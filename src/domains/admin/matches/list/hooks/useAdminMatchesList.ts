'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { DeleteMatchDocument, type DeleteMatchMutation, type DeleteMatchMutationVariables } from '@/graphql';

export const useAdminMatchesList = () => {
  const router = useRouter();

  // Mutation hook to delete a match
  // Returns the mutation function and loading state
  const [deleteMatchMutation, { loading: deleteLoading }] = useMutation<
    DeleteMatchMutation,
    DeleteMatchMutationVariables
  >(DeleteMatchDocument);

  const onDeleteMatch = async (id: string) => {
    await deleteMatchMutation({ variables: { id } });
    // Trigger SSR refetch by refreshing the router
    router.refresh();
  };

  return {
    deleteLoading,
    onDeleteMatch,
  };
};
