import React from 'react';
import type { Match } from './contracts';
import MatchCard from './components/MatchCard';
import { MatchStatus } from '@/graphql';
type MatchViewUiProps = {
  matches: Match[];
  error?: unknown;
};

const compareMatches = (a: Match, b: Match) => {
  const aTime = new Date(a.date).getTime();
  const bTime = new Date(b.date).getTime();

  // Primary: chronological
  if (aTime !== bTime) return aTime - bTime;

  // Secondary: push cancelled last
  if (a.status === MatchStatus.Cancelled && b.status !== MatchStatus.Cancelled) return 1;
  if (b.status === MatchStatus.Cancelled && a.status !== MatchStatus.Cancelled) return -1;

  return a.id.localeCompare(b.id);
};

const MatchViewUi = ({ matches, error }: MatchViewUiProps) => {
  const sortedMatches = [...matches].sort(compareMatches);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Matches{' '}
          <span className="text-muted-foreground font-normal text-2xl">
            ({sortedMatches.length} {sortedMatches.length === 1 ? 'match' : 'matches'})
          </span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl leading-relaxed">
          Complete schedule and results of all tournament matches
        </p>

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
