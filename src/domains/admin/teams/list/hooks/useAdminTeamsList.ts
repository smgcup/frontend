'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { TeamsWithPlayersDocument, type TeamsWithPlayersQuery, type TeamsWithPlayersQueryVariables } from '@/graphql';
import { mapTeamWithPlayers } from '@/domains/team/mappers/mapTeamWithPlayers';

export const useAdminTeamsList = () => {
  const { data, loading, error, refetch } = useQuery<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>(
    TeamsWithPlayersDocument,
  );

  const teams = useMemo(() => (data?.teams ?? []).map(mapTeamWithPlayers), [data?.teams]);

  return {
    teams,
    teamsLoading: loading,
    teamsError: error,
    refetchTeams: refetch,
  };
};


