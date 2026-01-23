import React, { useState, useMemo } from 'react';
import type { Match } from './contracts';
import MatchCard from './components/MatchCard';
import { MatchStatus } from '@/graphql';
import { Button } from '@/components/ui/button';
type MatchViewUiProps = {
  matches: Match[];
  error?: unknown;
};

const compareMatches = (a: Match, b: Match) => {
  // Primary: live matches first
  if (a.status === MatchStatus.Live && b.status !== MatchStatus.Live) return -1;
  if (b.status === MatchStatus.Live && a.status !== MatchStatus.Live) return 1;

  const aTime = new Date(a.date).getTime();
  const bTime = new Date(b.date).getTime();

  // Secondary: chronological
  if (aTime !== bTime) return aTime - bTime;

  // Tertiary: push cancelled last
  if (a.status === MatchStatus.Cancelled && b.status !== MatchStatus.Cancelled) return 1;
  if (b.status === MatchStatus.Cancelled && a.status !== MatchStatus.Cancelled) return -1;

  return a.id.localeCompare(b.id);
};

const MatchViewUi = ({ matches, error }: MatchViewUiProps) => {
  const [selectedRound, setSelectedRound] = useState(1);

  const filteredMatches = useMemo(() => {
    return matches.filter((match) => match.round === selectedRound);
  }, [matches, selectedRound]);

  const sortedMatches = [...filteredMatches].sort(compareMatches);

  const rounds = [1, 2, 3, 4];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Matches{' '}
          <span className="text-muted-foreground font-normal text-2xl">
            ({sortedMatches.length} {sortedMatches.length === 1 ? 'match' : 'matches'})
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl leading-relaxed">
          Complete schedule and results of all tournament matches
        </p>

        <div className="flex gap-2 mb-12 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
          {rounds.map((round) => (
            <Button
              key={round}
              variant={selectedRound === round ? 'default' : 'outline'}
              onClick={() => setSelectedRound(round)}
              className="rounded-full p-4"
            >
              Round {round}
            </Button>
          ))}
        </div>

        {Boolean(error) && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive mb-8">
            <p>Error loading matches. Please try again later.</p>
          </div>
        )}

        {sortedMatches.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No matches scheduled at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MatchViewUi;
