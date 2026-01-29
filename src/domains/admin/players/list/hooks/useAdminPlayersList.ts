'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type { DeletePlayerMutation, DeletePlayerMutationVariables } from '@/graphql';
import { DeletePlayerDocument } from '@/graphql';
import type { Team } from '@/domains/team/contracts';
import { getErrorMessage } from '@/domains/admin/utils/getErrorMessage';

export const useAdminPlayersList = (teams: Team[]) => {
  // Convenience: many list UIs want a flat list, but the SSR payload is grouped by team.
  const players = useMemo(() => teams.flatMap((t) => t?.players ?? []), [teams]);

  // Local UI state for one-off actions (delete) that shouldn't wipe out the SSR-hydrated list.
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  const [deletePlayerMutation] = useMutation<DeletePlayerMutation, DeletePlayerMutationVariables>(DeletePlayerDocument);

  const onDeletePlayer = async (id: string) => {
    setActionError(null);
    setDeletingPlayerId(id);
    try {
      await deletePlayerMutation({ variables: { id } });
    } catch (e) {
      setActionError(getErrorMessage(e));
    } finally {
      setDeletingPlayerId(null);
    }
  };

  return {
    teams,
    players,
    actionError,
    deletingPlayerId,
    onDeletePlayer,
  };
};
