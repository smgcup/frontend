'use client';

import React from 'react';
import Image from 'next/image';
import type { PlayersPageData, PlayerStanding, StandingsCategory } from './ssr/getPlayersPageData';
import { cn } from '@/lib/utils';

interface PlayersViewProps {
  data: PlayersPageData;
}

const PlayersView = ({ data }: PlayersViewProps) => {
  const { standings } = data;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Premier League 2025/26 Player Stats</h1>

        {/* Scrollable Container for Mobile, Grid for Desktop */}
        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 xl:grid-cols-4 md:gap-6 snap-x snap-mandatory md:snap-none pb-4 hide-scrollbar">
          {standings.map((category) => (
            <StandingsColumn key={category.title} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StandingsColumn = ({ category }: { category: StandingsCategory }) => {
  return (
    <div className="min-w-[80vw] md:min-w-0 snap-center shrink-0 md:shrink">
      <button
        type="button"
        className="group flex items-center gap-1 mb-4 cursor-pointer text-left px-2 py-1 -mx-2 -my-1 rounded-md transition-colors md:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => {
          // TODO: Add navigation/handler logic
        }}
      >
        <span className="text-xl font-bold">{category.title}</span>
        <span className="text-muted-foreground text-sm">&gt;</span>
      </button>

      <div className="bg-card rounded-xl overflow-hidden border">
        {category.players.map((player, index) => (
          <PlayerRow key={player.id} player={player} isLast={index === category.players.length - 1} />
        ))}
      </div>
    </div>
  );
};

const PlayerRow = ({ player, isLast }: { player: PlayerStanding; isLast: boolean }) => {
  return (
    <div
      className={cn(
        'flex items-center p-3 hover:bg-muted transition-colors h-[72px]',
        !isLast && 'border-b border-border',
      )}
    >
      <span className="w-6 text-center font-medium text-lg mr-2 shrink-0">{player.rank}</span>

      {/* Player Image */}
      <div className="w-10 h-10 mr-3 shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
          {player.imageUrl ? (
            <Image
              src={player.imageUrl}
              alt={player.lastName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs">?</div>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 mr-2">
        <div className="font-bold text-sm truncate leading-tight">
          {player.firstName} {player.lastName}
        </div>
        <div className="text-xs text-muted-foreground truncate">{player.teamName}</div>
      </div>

      <div className="font-bold text-xl shrink-0">{player.statValue}</div>
    </div>
  );
};

export default PlayersView;
