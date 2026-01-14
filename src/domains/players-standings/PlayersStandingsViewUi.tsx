'use client';

import React from 'react';
import type { PlayersPageData } from './contracts';
import StandingsColumn from './components/StandingsColumn';

type PlayersStandingsViewUiProps = {
  data: PlayersPageData;
};

const PlayersStandingsViewUi = ({ data }: PlayersStandingsViewUiProps) => {
  const { standings } = data;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Premier League 2025/26 Player Stats</h1>

        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 snap-x snap-mandatory md:snap-none pb-4 hide-scrollbar">
          {standings.map((category) => (
            <StandingsColumn key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlayersStandingsViewUi;
