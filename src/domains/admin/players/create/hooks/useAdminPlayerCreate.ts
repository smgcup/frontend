import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  AdminCreatePlayerDocument,
  AdminCreatePlayerMutation,
  AdminCreatePlayerMutationVariables,
  TeamsDocument,
  TeamsQuery,
} from '@/graphql';
import { mapPlayerTeam } from '@/domains/player/mappers/mapPlayerTeam';
import type { PlayerCreate } from '@/domains/player/contracts';
import { mapPlayerCreateToDto } from '@/domains/player/mappers/mapPlayerCreateToDto';
export const useAdminPlayerCreate = () => {
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery<TeamsQuery>(TeamsDocument);

  const teams = useMemo(() => (teamsData?.teams ?? []).map(mapPlayerTeam), [teamsData]);

  const [adminCreatePlayerMutation, { loading: adminPlayerCreateLoading, error: adminPlayerCreateError }] = useMutation<
    AdminCreatePlayerMutation,
    AdminCreatePlayerMutationVariables
  >(AdminCreatePlayerDocument);

  const handleAdminPlayerCreate = async (createPlayer: PlayerCreate) => {
    await adminCreatePlayerMutation({
      variables: { createPlayerDto: mapPlayerCreateToDto(createPlayer) },
    });
  };
  return {
    teams,
    teamsLoading,
    teamsError: teamsError ?? null,
    adminPlayerCreateLoading,
    adminPlayerCreateError: adminPlayerCreateError ?? null,
    onAdminPlayerCreate: handleAdminPlayerCreate,
  };
};
