import { getTeamsData } from '@/lib/cachedQueries';
import { Team } from '@/domains/team/contracts';

const removeEmptyPlayers = (team: Team) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { players, ...rest } = team;
  return rest;
};

export const getTeamStandingsPageData = async () => {
  const teams = await getTeamsData();

  return { teams: teams.map(removeEmptyPlayers) };
};
