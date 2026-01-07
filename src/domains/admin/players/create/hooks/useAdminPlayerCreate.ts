import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  AdminCreatePlayerDocument,
  AdminCreatePlayerMutation,
  AdminCreatePlayerMutationVariables,
  CreatePlayerDto,
  TeamsDocument,
  TeamsQuery,
} from '@/graphql';
import { mapPlayerTeam } from '@/domains/player/mappers/mapPlayerTeam';
export const useAdminPlayerCreate = () => {
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery<TeamsQuery>(TeamsDocument);

  const teams = useMemo(() => (teamsData?.teams ?? []).map(mapPlayerTeam), [teamsData]);

  const [adminCreatePlayerMutation, { loading: adminPlayerCreateLoading, error: adminPlayerCreateError }] = useMutation<
    AdminCreatePlayerMutation,
    AdminCreatePlayerMutationVariables
  >(AdminCreatePlayerDocument);

  const handleAdminPlayerCreate = async (createPlayerDto: CreatePlayerDto) => {
    await adminCreatePlayerMutation({
      variables: { createPlayerDto },
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
