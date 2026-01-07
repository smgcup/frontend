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

export const useAdminMatchesList = () => {
  const { data, loading: matchesLoading, error: matchesError, refetch } = useQuery<MatchesQuery, MatchesQueryVariables>(
    MatchesDocument,
  );

  const [deleteMatchMutation, { loading: deleteLoading }] = useMutation<
    DeleteMatchMutation,
    DeleteMatchMutationVariables
  >(DeleteMatchDocument);

  const matches = useMemo(() => {
    return (
      data?.matches.map((m) => ({
        id: m.id,
        firstOpponent: { id: m.firstOpponent.id, name: m.firstOpponent.name },
        secondOpponent: { id: m.secondOpponent.id, name: m.secondOpponent.name },
        date: String(m.date),
        status: m.status,
        ...(m.score1 == null ? {} : { score1: m.score1 }),
        ...(m.score2 == null ? {} : { score2: m.score2 }),
      })) ?? []
    );
  }, [data]);

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


