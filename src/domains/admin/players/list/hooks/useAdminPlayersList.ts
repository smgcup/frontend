'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import type { DeletePlayerMutation, DeletePlayerMutationVariables } from '@/graphql';
import { DeletePlayerDocument } from '@/graphql';
import type { TeamWithPlayers } from '@/domains/team/contracts';
import { getErrorMessage } from '@/domains/admin/players/utils/getErrorMessage';

export const useAdminPlayersList = (initialTeams: TeamWithPlayers[]) => {
  // SSR: hydrate the list with server-fetched data
  const [teams, setTeams] = useState<TeamWithPlayers[]>(initialTeams);

  // Keep state in sync if the server-provided teams ever change (navigation / re-render).
  useEffect(() => {
    setTeams(initialTeams);
  }, [initialTeams]);

  // Convenience: many list UIs want a flat list, but the SSR payload is grouped by team.
  const players = useMemo(() => teams.flatMap((t) => t.players), [teams]);

  // Local UI state for one-off actions (delete) that shouldn't wipe out the SSR-hydrated list.
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingPlayerId, setDeletingPlayerId] = useState<string | null>(null);

  const [deletePlayerMutation] = useMutation<DeletePlayerMutation, DeletePlayerMutationVariables>(DeletePlayerDocument);

  const onDeletePlayer = async (id: string) => {
    setActionError(null);
    setDeletingPlayerId(id);
    try {
      await deletePlayerMutation({ variables: { id } });
      // We don't refetch the whole list here: the page is SSR-hydrated and we want the UI to
      // reflect the change immediately without a second network roundtrip.
      setTeams((prev) =>
        prev.map((team) => ({
          ...team,
          players: team.players.filter((p) => p.id !== id),
        })),
      );
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
