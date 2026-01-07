'use client';

import { useMutation, useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import {
  DeletePlayerDocument,
  DeletePlayerMutation,
  DeletePlayerMutationVariables,
  TeamsWithPlayersDocument,
  TeamsWithPlayersQuery,
  TeamsWithPlayersQueryVariables,
  UpdatePlayerDocument,
  UpdatePlayerMutation,
  UpdatePlayerMutationVariables,
  type UpdatePlayerDto,
  type PreferredFoot as GqlPreferredFoot,
  type PlayerPosition as GqlPlayerPosition,
} from '@/graphql';
import { mapPlayerTeam } from '@/domains/player/mappers/mapPlayerTeam';
import { mapPlayerEdit } from '@/domains/player/mappers/mapPlayerEdit';
import type { PlayerUpdate } from '@/domains/player/contracts';

export const useAdminPlayerEdit = (playerId: string) => {
  // NOTE: We intentionally avoid `playerById { team { ... } }` because the backend can throw:
  // "Cannot return null for non-nullable field Player.team."
  // That bubbles and results in `playerById` being null => empty edit form.
  // TeamsWithPlayers does not request `Player.team`, so we can still load player data and derive the team from nesting.
  const {
    data: teamsData,
    loading: teamsLoading,
    error: teamsError,
  } = useQuery<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>(TeamsWithPlayersDocument);

  const teams = useMemo(() => (teamsData?.teams ?? []).map(mapPlayerTeam), [teamsData]);

  const player = useMemo(() => {
    const teams = teamsData?.teams ?? [];
    for (const team of teams) {
      const found = (team.players ?? []).find((p) => p.id === playerId);
      if (found) {
        return mapPlayerEdit(found, { id: team.id, name: team.name });
      }
    }
    return undefined;
  }, [teamsData?.teams, playerId]);

  const [updatePlayerMutation, { loading: updateLoading, error: updateError }] = useMutation<
    UpdatePlayerMutation,
    UpdatePlayerMutationVariables
  >(UpdatePlayerDocument);

  const [deletePlayerMutation, { loading: deleteLoading, error: deleteError }] = useMutation<
    DeletePlayerMutation,
    DeletePlayerMutationVariables
  >(DeletePlayerDocument);

  const handleUpdatePlayer = async (dto: PlayerUpdate) => {
    const gqlDto: UpdatePlayerDto = {};
    if (dto.firstName !== undefined) gqlDto.firstName = dto.firstName;
    if (dto.lastName !== undefined) gqlDto.lastName = dto.lastName;
    if (dto.teamId !== undefined) gqlDto.teamId = dto.teamId;
    if (dto.height !== undefined) gqlDto.height = dto.height;
    if (dto.weight !== undefined) gqlDto.weight = dto.weight;
    if (dto.yearOfBirth !== undefined) gqlDto.yearOfBirth = dto.yearOfBirth;
    if (dto.imageUrl !== undefined) gqlDto.imageUrl = dto.imageUrl;
    if (dto.position !== undefined) gqlDto.position = dto.position as unknown as GqlPlayerPosition;
    if (dto.preferredFoot !== undefined) gqlDto.prefferedFoot = dto.preferredFoot as unknown as GqlPreferredFoot;

    return await updatePlayerMutation({
      variables: { id: playerId, dto: gqlDto },
    });
  };

  const handleDeletePlayer = async () => {
    return await deletePlayerMutation({
      variables: { id: playerId },
    });
  };

  return {
    teams,
    teamsLoading,
    teamsError: teamsError ?? null,
    player,
    playerLoading: teamsLoading,
    playerError: teamsError,
    updateLoading,
    updateError,
    deleteLoading,
    deleteError,
    onUpdatePlayer: handleUpdatePlayer,
    onDeletePlayer: handleDeletePlayer,
  };
};


