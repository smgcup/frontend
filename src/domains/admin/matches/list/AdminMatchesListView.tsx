'use client';

import AdminMatchesListViewUi from './AdminMatchesListViewUi';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  DeleteMatchDocument,
  type DeleteMatchMutation,
  type DeleteMatchMutationVariables,
  MatchesDocument,
  type MatchesQuery,
  type MatchesQueryVariables,
} from '@/graphql';

const AdminMatchesListView = () => {
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

  const matches: Parameters<typeof AdminMatchesListViewUi>[0]['matches'] =
    data?.matches.map((m) => ({
      id: m.id,
      firstOpponent: { id: m.firstOpponent.id, name: m.firstOpponent.name },
      secondOpponent: { id: m.secondOpponent.id, name: m.secondOpponent.name },
      date: String(m.date),
      status: m.status,
      ...(m.score1 == null ? {} : { score1: m.score1 }),
      ...(m.score2 == null ? {} : { score2: m.score2 }),
    })) ?? [];

  const onDeleteMatch = async (id: string) => {
    await deleteMatchMutation({ variables: { id } });
    await refetch();
  };

  return (
    <AdminMatchesListViewUi
      matches={matches}
      matchesLoading={matchesLoading}
      matchesError={matchesError}
      deleteLoading={deleteLoading}
      onDeleteMatch={onDeleteMatch}
    />
  );
};

export default AdminMatchesListView;

