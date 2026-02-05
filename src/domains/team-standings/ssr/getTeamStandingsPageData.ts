import { getPublicClient } from '@/lib/initializeApollo';
import { GetTeamsDocument } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { Team } from '@/domains/team/contracts';

const removeEmptyPlayers = (team: Team) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { players, ...rest } = team;
  return rest;
};

export const getTeamStandingsPageData = async () => {
  const client = getPublicClient();
  const { data } = await client.query({ query: GetTeamsDocument });
  const teams = data?.teams.map(mapTeam) ?? [];

  return { teams: teams.map(removeEmptyPlayers) };
};
