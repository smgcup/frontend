'use client';

import React from 'react';
import { Team } from '@/domains/team/contracts';
import StandingsTable from '@/components/StandingsTable';
import { Users2, CalendarCheck, Target, BarChart2 } from 'lucide-react';

const MOCK_STATS = {
  teams: 16,
  matchesPlayed: 0,
  goals: 0,
  avgGoals: 0,
};

type TournamentStatisticsProps = {
  teams: Team[];
};

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="text-muted-foreground/80">{icon}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
    </div>
  );
}

const TournamentStatistics = ({ teams }: TournamentStatisticsProps) => {
  const stats = MOCK_STATS;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tournament Statistics</h2>
          <p className="mt-4 text-lg text-muted-foreground">Overview of teams&apos; performance and key metrics</p>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Teams" value={stats.teams} icon={<Users2 className="h-5 w-5 sm:h-6 sm:w-6" />} />
          <StatCard
            label="Matches played"
            value={stats.matchesPlayed}
            icon={<CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6" />}
          />
          <StatCard label="Goals" value={stats.goals} icon={<Target className="h-5 w-5 sm:h-6 sm:w-6" />} />
          <StatCard label="Avg goals" value={stats.avgGoals} icon={<BarChart2 className="h-5 w-5 sm:h-6 sm:w-6" />} />
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
