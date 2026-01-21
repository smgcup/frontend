import { TeamView } from '@/domains/team/TeamView';
import { getTeamPageData } from '@/domains/team/ssr/getTeamPageData';

type TeamPageProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = await params;
  const team = await getTeamPageData(teamId);

  return <TeamView team={team} />;
}
