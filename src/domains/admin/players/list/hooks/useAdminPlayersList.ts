'use client';

import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { DeletePlayerMutation, DeletePlayerMutationVariables } from '@/graphql';
import { DeletePlayerDocument } from '@/graphql';

const getErrorMessage = (e: unknown) => {
  if (!e) return 'Unknown error';
  if (typeof e === 'string') return e;
  if (typeof e === 'object' && e && 'message' in e && typeof (e as { message: unknown }).message === 'string') {
    return (e as { message: string }).message;
  }
  return String(e);
};

export const useAdminPlayersList = () => {
  const router = useRouter();

  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  const [deletePlayerMutation] = useMutation<DeletePlayerMutation, DeletePlayerMutationVariables>(DeletePlayerDocument);

  const onDeletePlayer = async (id: string) => {
    setActionError(null);
    setDeletingPlayerId(id);
    try {
      await deletePlayerMutation({ variables: { id } });
      router.refresh();
    } catch (e) {
      setActionError(getErrorMessage(e));
    } finally {
      setDeletingPlayerId(null);
    }
  };

  return {
    actionError,
    deletingPlayerId,
    onDeletePlayer,
  };
};


