import PlayerView from '@/domains/player/PlayerView';
import { getPlayerPageData } from '@/domains/player/ssr/getPlayerPageData';
import { BackButton } from '@/components/BackButton';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

type PlayerPageProps = {
  params: Promise<{ playerId: string }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerId } = await params;
  const { player, error } = await getPlayerPageData(playerId);

  if (error || !player) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <BackButton />
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p>{error || 'Player not found'}</p>
          </div>
        </div>
      </main>
    );
  }

  return <PlayerView player={player} />;
}
