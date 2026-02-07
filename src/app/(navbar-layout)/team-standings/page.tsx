import TeamStandingsView from '@/domains/team-standings/TeamStandingsView';
import { getTeamStandingsPageData } from '@/domains/team-standings/ssr/getTeamStandingsPageData';

export const revalidate = 300;

export default async function Page() {
  const data = await getTeamStandingsPageData();

  return <TeamStandingsView teams={data.teams} />;
}
