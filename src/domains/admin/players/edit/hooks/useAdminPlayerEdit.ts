'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import {
  DeletePlayerDocument,
  DeletePlayerMutation,
  DeletePlayerMutationVariables,
  TeamsWithPlayersDocument,
  TeamsWithPlayersQuery,
  TeamsWithPlayersQueryVariables,
  UpdatePlayerDocument,
  UpdatePlayerDto,
  UpdatePlayerMutation,
  UpdatePlayerMutationVariables,
} from '@/graphql';

export const useAdminPlayerEdit = (playerId: string) => {
  // NOTE: We intentionally avoid `playerById { team { ... } }` because the backend can throw:
  // "Cannot return null for non-nullable field Player.team."
  // That bubbles and results in `playerById` being null => empty edit form.
  // TeamsWithPlayers does not request `Player.team`, so we can still load player data and derive the team from nesting.
  const {
    data: teamsData,
    loading: playerLoading,
    error: playerError,
  } = useQuery<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>(TeamsWithPlayersDocument);

  const player = (() => {
    const teams = teamsData?.teams ?? [];
    for (const team of teams) {
      const found = (team.players ?? []).find((p) => p.id === playerId);
      if (found) {
        return {
          ...found,
          team: { id: team.id, name: team.name },
        };
      }
    }
    return undefined;
  })();

  const [updatePlayerMutation, { loading: updateLoading, error: updateError }] = useMutation<
    UpdatePlayerMutation,
    UpdatePlayerMutationVariables
  >(UpdatePlayerDocument);

  const [deletePlayerMutation, { loading: deleteLoading, error: deleteError }] = useMutation<
    DeletePlayerMutation,
    DeletePlayerMutationVariables
  >(DeletePlayerDocument);

  const handleUpdatePlayer = async (dto: UpdatePlayerDto) => {
    return await updatePlayerMutation({
      variables: { id: playerId, dto },
    });
  };

  const handleDeletePlayer = async () => {
    return await deletePlayerMutation({
      variables: { id: playerId },
    });
  };

  return {
    player,
    playerLoading,
    playerError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    onUpdatePlayer: handleUpdatePlayer,
    onDeletePlayer: handleDeletePlayer,
  };
};


