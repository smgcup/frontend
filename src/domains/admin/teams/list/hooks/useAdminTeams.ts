'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { DeleteTeamDocument, type DeleteTeamMutation, type DeleteTeamMutationVariables } from '@/graphql';

const getErrorMessage = (e: unknown) => {
  if (!e) return 'Unknown error';
  if (typeof e === 'string') return e;
  if (typeof e === 'object' && e && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
    return (e as { message: string }).message;
  }
  return String(e);
};

export const useAdminTeams = () => {
  const router = useRouter();

  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  const [deleteTeamMutation] = useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(DeleteTeamDocument);

  const onDeleteTeam = async (id: string) => {
    setActionError(null);
    setDeletingTeamId(id);
    try {
      await deleteTeamMutation({ variables: { id } });
      router.refresh();
    } catch (e) {
      setActionError(getErrorMessage(e));
    } finally {
      setDeletingTeamId(null);
    }
  };

  return {
    actionError,
    deletingTeamId,
    onDeleteTeam,
  };
};
