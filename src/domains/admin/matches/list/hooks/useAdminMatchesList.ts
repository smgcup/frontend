'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import {
  DeleteMatchDocument,
  type DeleteMatchMutation,
  type DeleteMatchMutationVariables,
  StartMatchDocument,
  type StartMatchMutation,
  type StartMatchMutationVariables,
} from '@/graphql';

export const useAdminMatchesList = () => {
  const router = useRouter();

  // Mutation hook to delete a match
  // Returns the mutation function and loading state
  const [deleteMatchMutation, { loading: deleteLoading }] = useMutation<
    DeleteMatchMutation,
    DeleteMatchMutationVariables
  >(DeleteMatchDocument);

  // Mutation hook to start a match
  const [startMatchMutation] = useMutation<StartMatchMutation, StartMatchMutationVariables>(StartMatchDocument);

  const onDeleteMatch = async (id: string) => {
    await deleteMatchMutation({ variables: { id } });
    // Trigger SSR refetch by refreshing the router
    router.refresh();
  };

  const onStartMatch = async (id: string) => {
    await startMatchMutation({ variables: { id } });
    // Trigger SSR refetch by refreshing the router
    router.refresh();
  };

  return {
    deleteLoading,
    onDeleteMatch,
    onStartMatch,
  };
};
