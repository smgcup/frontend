import { TeamView } from '@/domains/team/TeamView';
import { getTeamPageData } from '@/domains/team/ssr/getTeamPageData';
import { BackButton } from './BackButton';

type TeamPageProps = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = await params;
  const { team, error } = await getTeamPageData(teamId);

  if (error || !team) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p>{error || 'Team not found'}</p>
          </div>
        </div>
      </main>
    );
  }

  return <TeamView team={team} />;
}
