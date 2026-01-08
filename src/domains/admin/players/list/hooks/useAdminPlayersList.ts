'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import type {
  DeletePlayerMutation,
  DeletePlayerMutationVariables,
  TeamsWithPlayersQuery,
  TeamsWithPlayersQueryVariables,
} from '@/graphql';
import { DeletePlayerDocument, TeamsWithPlayersDocument } from '@/graphql';
import { mapTeamWithPlayers } from '@/domains/team/mappers/mapTeamWithPlayers';

const getErrorMessage = (e: unknown) => {
  if (!e) return 'Unknown error';
  if (typeof e === 'string') return e;
  if (typeof e === 'object' && e && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
    return (e as { message: string }).message;
  }
  return String(e);
};

export const useAdminPlayersList = () => {
  const { data, loading, error, refetch } = useQuery<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>(
    TeamsWithPlayersDocument,
  );

  const teams = useMemo(() => (data?.teams ?? []).map(mapTeamWithPlayers), [data?.teams]);
  const players = useMemo(() => teams.flatMap((t) => t.players), [teams]);

  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  const [deletePlayerMutation] = useMutation<DeletePlayerMutation, DeletePlayerMutationVariables>(DeletePlayerDocument);

  const onDeletePlayer = async (id: string) => {
    setActionError(null);
    setDeletingPlayerId(id);
    try {
      await deletePlayerMutation({ variables: { id } });
      await refetch();
    } catch (e) {
      setActionError(getErrorMessage(e));
    } finally {
      setDeletingPlayerId(null);
    }
  };

  return {
    teams,
    players,
    loading,
    error,
    actionError,
    deletingPlayerId,
    onDeletePlayer,
  };
};
