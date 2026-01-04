import Link from 'next/link';
import MatchCard, { type Match } from '@/domains/matches/components/MatchCard';
import { Button } from '@/components/ui';
import { ArrowRight, Trophy } from 'lucide-react';
import type { Team } from '@/domains/team/contracts';

type UpcomingMatchesSectionProps = {
  teams: Team[];
};
const UpcomingMatchesSection = ({ teams }: UpcomingMatchesSectionProps) => {
  const matches: Match[] = [
    {
      id: '1',
      team1: '10A',
      team2: '10B',
      date: '2024-01-15',
      time: '14:00',
      venue: 'Main Field',
      status: 'upcoming',
      round: 1,
    },
    {
      id: '2',
      team1: '11A',
      team2: '11B',
      date: '2024-01-16',
      time: '15:30',
      venue: 'Main Field',
      status: 'upcoming',
      round: 1,
    },
    {
      id: '3',
      team1: '12A',
      team2: '12B',
      date: '2024-01-17',
      time: '16:00',
      venue: 'Main Field',
      status: 'upcoming',
      round: 1,
    },
    {
      id: '4',
      team1: '9A',
      team2: '9B',
      date: '2024-01-18',
      time: '14:30',
      venue: 'Main Field',
      status: 'upcoming',
      round: 1,
    },
  ];

  // Show only first 3 matches
  const displayedMatches = matches.slice(0, 3);
  const hasMoreMatches = matches.length > 3;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              <Trophy className="h-4 w-4" />
              <span>Live Schedule</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
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
