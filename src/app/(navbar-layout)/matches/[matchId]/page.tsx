import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EventTimeline from '@/domains/matches/components/EventTimeline';
import { getMatchDetailPageData } from '@/domains/matches/ssr/getMatchDetailPageData';
import RefreshButton from '../../../../domains/matches/components/RefreshButton';
import { BackButton } from '@/components/BackButton';
import { MatchStatus } from '@/generated/types';

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

  const mvpTeam =
    match.mvp &&
    (match.firstOpponent.players?.some((p) => p.id === match.mvp?.id)
      ? match.firstOpponent.name
      : match.secondOpponent.name);

  return (
    <section className="pb-10 pt-8 px-4 sm:px-6 lg:px-8">
      <BackButton />
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <Link href={`/teams/${match.firstOpponent.id}`} className="hover:underline">{match.firstOpponent.name}</Link> vs <Link href={`/teams/${match.secondOpponent.id}`} className="hover:underline">{match.secondOpponent.name}</Link>
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
                <Link href={`/teams/${match.firstOpponent.id}`} className="text-lg font-bold mb-2 hover:underline inline-block">{match.firstOpponent.name}</Link>
                <p className="text-5xl font-black text-primary">{score1}</p>
              </div>
              <div className="shrink-0 text-3xl font-bold text-muted-foreground">—</div>
              <div className="flex-1 text-center">
                <Link href={`/teams/${match.secondOpponent.id}`} className="text-lg font-bold mb-2 hover:underline inline-block">{match.secondOpponent.name}</Link>
                <p className="text-5xl font-black text-primary">{score2}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {match.mvp && (
          <Link
            href={`/players/${match.mvp.id}`}
            className="group block rounded-xl border-2 border-primary/20 overflow-hidden bg-card ring-1 ring-foreground/10 transition-colors hover:border-primary/40 hover:bg-primary/5 lg:py-2 lg:px-6"
          >
            <div className="flex items-center gap-6 pt-4 pb-4 px-4 sm:px-6">
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <p className="text-muted-foreground text-lg leading-tight">{match.mvp.firstName}</p>
                  <p className="text-foreground text-3xl font-bold leading-tight">{match.mvp.lastName}</p>
                  {(match.mvp.position || mvpTeam) && (
                    <p className="text-muted-foreground text-sm font-medium mt-1">
                      {[
                        match.mvp.position && match.mvp.position.charAt(0) + match.mvp.position.slice(1).toLowerCase(),
                        mvpTeam,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                </div>
                <p className="text-primary font-bold text-lg">Man of the Match</p>
              </div>
              {match.mvp.celebrationImageUrl && (
                <div className="flex shrink-0 items-center justify-center">
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-muted aspect-square">
                    <Image
                      src={match.mvp.celebrationImageUrl}
                      alt={`${match.mvp.firstName} ${match.mvp.lastName}`}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              )}
            </div>
          </Link>
        )}

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
