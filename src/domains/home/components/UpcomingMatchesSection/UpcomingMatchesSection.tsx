import React from 'react';
import Link from 'next/link';
import MatchCard, { Match } from '@/domains/matches/components/MatchCard';
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { Team } from '@/domains/team/contracts';

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
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Upcoming Matches</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Don&apos;t miss the exciting matches between the teams in the league
            </p>
          </div>
          {hasMoreMatches && (
            <div className="flex justify-center sm:justify-end">
              <Button asChild variant="outline" size="lg">
                <Link href="/matches">
                  View All Matches
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {displayedMatches.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No upcoming matches scheduled at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingMatchesSection;
