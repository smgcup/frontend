import { getClient } from '@/lib/initializeApollo';
import {
  GetTeamsDocument,
  GetTeamsQuery,
  GetTeamsQueryVariables,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { Team } from '@/domains/team/contracts';

const removeEmptyPlayers = (team: Team) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { players, ...rest } = team;
  return rest;
};

export const getTeamStandingsPageData = async () => {
  const client = await getClient();

  const { data: teamsData } = await client.query<GetTeamsQuery, GetTeamsQueryVariables>({
    query: GetTeamsDocument,
  });

  const teams = teamsData?.teams.map(team => removeEmptyPlayers(mapTeam(team))) ?? [];

  return { teams };
};