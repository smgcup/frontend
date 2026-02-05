import TeamStandingsView from '@/domains/team-standings/TeamStandingsView';
import { getTeamStandingsPageData } from '@/domains/team-standings/ssr/getTeamStandingsPageData';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

export default async function TeamStandingsPage() {
  const data = await getTeamStandingsPageData();

  return <TeamStandingsView teams={data.teams} />;
}