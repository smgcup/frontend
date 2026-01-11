'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useRouter } from 'next/navigation';
import { DeleteTeamDocument, type DeleteTeamMutation, type DeleteTeamMutationVariables } from '@/graphql';
import type { TeamWithPlayers } from '@/domains/team/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export const useAdminTeamsList = (initialTeams: TeamWithPlayers[]) => {
  const router = useRouter();

  // SSR: hydrate the list with server-fetched data
  const [teams, setTeams] = useState<TeamWithPlayers[]>(initialTeams);

  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  const [deleteTeamMutation] = useMutation<DeleteTeamMutation, DeleteTeamMutationVariables>(DeleteTeamDocument);

  // Keep state in sync if the server-provided teams ever change (navigation / refresh).
  useEffect(() => {
    setTeams(initialTeams);
  }, [initialTeams]);

  const onDeleteTeam = async (id: string) => {
    setActionError(null);
    setDeletingTeamId(id);
    try {
      await deleteTeamMutation({ variables: { id } });
      setTeams((prev) => prev.filter((t) => t.id !== id));
      router.refresh();
    } catch (e) {
      setActionError(getErrorMessage(e));
    } finally {
      setDeletingTeamId(null);
    }
  };

  return {
    teams,
    actionError,
    deletingTeamId,
    onDeleteTeam,
  };
};
