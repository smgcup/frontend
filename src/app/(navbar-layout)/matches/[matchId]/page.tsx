import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EventTimeline from '@/domains/matches/components/EventTimeline';
import { getMatchDetailPageData } from '@/domains/matches/ssr/getMatchDetailPageData';
import RefreshButton from '../../../../domains/matches/components/RefreshButton';
import { MatchStatus } from '@/generated/types';

// Dynamic: Always fetch fresh data (needed for live match updates)
export const dynamic = 'force-dynamic';

type MatchDetailPageProps = {
  params: Promise<{ matchId: string }>;
};

const MatchDetailPage = async ({ params }: MatchDetailPageProps) => {
  const { matchId } = await params;
  const { match, events } = await getMatchDetailPageData(matchId);

  if (!match) notFound();

  const isLive = match.status === MatchStatus.Live;
  const currentMinute = Math.max(...events.map((e) => e.minute), 0);

  const score1 = match.score1 ?? 0;
  const score2 = match.score2 ?? 0;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {match.firstOpponent.name} vs {match.secondOpponent.name}
            </h1>
            <p className="text-muted-foreground mt-2">Match details</p>
          </div>
          <div className="shrink-0">
            <RefreshButton />
          </div>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-xl">Score</CardTitle>
              <Badge
                variant="outline"
                className={isLive ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' : ''}
              >
                {isLive ? `LIVE - ${currentMinute}'` : match.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1 text-center">
                <p className="text-lg font-bold mb-2">{match.firstOpponent.name}</p>
                <p className="text-5xl font-black text-primary">{score1}</p>
              </div>
              <div className="shrink-0 text-3xl font-bold text-muted-foreground">—</div>
              <div className="flex-1 text-center">
                <p className="text-lg font-bold mb-2">{match.secondOpponent.name}</p>
                <p className="text-5xl font-black text-primary">{score2}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Events</CardTitle>
          </CardHeader>
          <CardContent>
            {/* {isLive ? ( */}
            <EventTimeline
              events={events}
              firstOpponentName={match.firstOpponent.name}
              secondOpponentName={match.secondOpponent.name}
            />
            {/* // ) : ( */}
            {/* // <div className="rounded-lg border p-4 text-muted-foreground"> */}
            {/* // Events are shown for live matches. This match is currently:{' '} */}
            {/* // <span className="font-medium">{match.status}</span>. */}
            {/* // </div> */}
            {/* // )} */}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MatchDetailPage;
