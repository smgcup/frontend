'use client';

import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  DeleteMatchDocument,
  type DeleteMatchMutation,
  type DeleteMatchMutationVariables,
  MatchesDocument,
  type MatchesQuery,
  type MatchesQueryVariables,
} from '@/graphql';
import { mapMatchListItem } from '@/domains/matches/mappers/mapMatchListItem';

export const useAdminMatchesList = () => {
  const {
    data,
    loading: matchesLoading,
    error: matchesError,
    refetch,
  } = useQuery<MatchesQuery, MatchesQueryVariables>(MatchesDocument);

  const [deleteMatchMutation, { loading: deleteLoading }] = useMutation<
    DeleteMatchMutation,
    DeleteMatchMutationVariables
  >(DeleteMatchDocument);

  const matches = useMemo(() => {
    return data?.matches.map(mapMatchListItem) ?? [];
  }, [data?.matches]);

  const onDeleteMatch = async (id: string) => {
    await deleteMatchMutation({ variables: { id } });
    await refetch();
  };

  return {
    matches,
    matchesLoading,
    matchesError,
    deleteLoading,
    onDeleteMatch,
  };
};
