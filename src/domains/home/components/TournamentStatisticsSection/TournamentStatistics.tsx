'use client';

import React from 'react';
import { Team } from '@/domains/team/contracts';
import StandingsTable from '@/components/StandingsTable';

type TournamentStatisticsProps = {
  teams: Team[];
};
const TournamentStatistics = ({ teams }: TournamentStatisticsProps) => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tournament Statistics</h2>
          <p className="mt-4 text-lg text-muted-foreground">Overview of the league performance and key metrics</p>
        </div>

        {/* Standings Table */}
        <div className="mb-12">
          <StandingsTable teams={teams} limit={5} />
        </div>
      </div>
    </section>
  );
};

export default TournamentStatistics;
