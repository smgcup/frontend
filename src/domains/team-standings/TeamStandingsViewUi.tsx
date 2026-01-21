'use client';

import StandingsTable from '@/components/StandingsTable';
import { BackButton } from '@/components/BackButton';
import { Team } from '@/domains/team/contracts';

const TeamStandingsViewUi = ({ teams }: { teams: Team[] }) => {

  return (
    <section className="pb-16 pt-8 px-4 sm:px-6 lg:px-8">
      <BackButton />
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Team Standings</h1>
          <p className="mt-4 text-lg text-muted-foreground">Complete league standings and statistics</p>
        </div>

        <StandingsTable teams={teams} />
      </div>
    </section>
  );
};

export default TeamStandingsViewUi;