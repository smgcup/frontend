import Link from 'next/link';
import MatchCard from '@/domains/matches/components/MatchCard';
import { Button } from '@/components/ui';
import { ArrowRight, Trophy } from 'lucide-react';
import type { Team } from '@/domains/team/contracts';
import type { MatchListItem } from '@/domains/matches/ssr/getMatchesPageData';

type UpcomingMatchesSectionProps = {
  teams: Team[];
};
const UpcomingMatchesSection = ({}: UpcomingMatchesSectionProps) => {
  const matches: MatchListItem[] = [
    {
      id: '1',
      date: '2024-01-15T14:00:00',
      status: 'SCHEDULED',
      firstOpponent: { id: '10a', name: '10A' },
      secondOpponent: { id: '10b', name: '10B' },
    },
    {
      id: '2',
      date: '2024-01-16T15:30:00',
      status: 'SCHEDULED',
      firstOpponent: { id: '11a', name: '11A' },
      secondOpponent: { id: '11b', name: '11B' },
    },
    {
      id: '3',
      date: '2024-01-17T16:00:00',
      status: 'SCHEDULED',
      firstOpponent: { id: '12a', name: '12A' },
      secondOpponent: { id: '12b', name: '12B' },
    },
    {
      id: '4',
      date: '2024-01-18T14:30:00',
      status: 'SCHEDULED',
      firstOpponent: { id: '9a', name: '9A' },
      secondOpponent: { id: '9b', name: '9B' },
    },
  ];

  // Show only first 3 matches
  const displayedMatches = matches.slice(0, 3);
  const hasMoreMatches = matches.length > 3;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background via-primary/5 to-background" />

      <div className="container relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Trophy className="h-4 w-4" />
              <span>Live Schedule</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent pb-1.5">
              Upcoming Matches
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Don&apos;t miss the exciting matches between the teams in the league
            </p>
          </div>
          {hasMoreMatches && (
            <div className="flex justify-center sm:justify-end">
              <Button asChild variant="default" size="lg" className="gap-2 shadow-lg shadow-primary/20">
                <Link href="/matches">
                  View All Matches
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {displayedMatches.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No upcoming matches scheduled at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingMatchesSection;
