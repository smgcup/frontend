'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { DeleteTeamDocument, type DeleteTeamMutation, type DeleteTeamMutationVariables } from '@/graphql';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export const useAdminTeamsList = () => {
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
