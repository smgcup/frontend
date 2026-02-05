import TeamStandingsView from '@/domains/team-standings/TeamStandingsView';
import { getTeamStandingsPageData } from '@/domains/team-standings/ssr/getTeamStandingsPageData';

// Avoid prerender at build time (API may be unavailable); render on request
export const dynamic = 'force-dynamic';

export default async function Page() {
  const data = await getTeamStandingsPageData();

  return <TeamStandingsView teams={data.teams} />;
}
