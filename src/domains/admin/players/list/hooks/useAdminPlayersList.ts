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

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | 'all'>('all');

  const playerIdToTeamId = useMemo(() => {
    const map = new Map<string, string>();
    for (const team of teams) {
      if (!team?.id) continue;
      for (const player of team?.players ?? []) {
        if (player?.id) map.set(player.id, team.id);
      }
    }
    return map;
  }, [teams]);

  const filteredPlayers = useMemo(() => {
    let result = players;
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const name = `${p.firstName} ${p.lastName}`.toLowerCase();
        return name.includes(query);
      });
    }
    if (selectedTeamId !== 'all') {
      result = result.filter((p) => playerIdToTeamId.get(p.id) === selectedTeamId);
    }
    return result;
  }, [players, searchQuery, selectedTeamId, playerIdToTeamId]);

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
    players: filteredPlayers,
    totalCount: players.length,
    searchQuery,
    setSearchQuery,
    selectedTeamId,
    setSelectedTeamId,
    actionError,
    deletingPlayerId,
    onDeletePlayer,
  };
};
