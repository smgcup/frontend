import React from 'react';
import type { StandingsCategory } from '../contracts';
import PlayerRow from './PlayerRow';

type StandingsColumnProps = {
  category: StandingsCategory;
};

const StandingsColumn = ({ category }: StandingsColumnProps) => {
  return (
    <div className="min-w-[80vw] md:min-w-0 snap-center shrink-0 md:shrink">
      <button
        type="button"
        className="group flex items-center gap-1 mb-4 cursor-pointer text-left px-2 py-1 -mx-2 -my-1 rounded-md transition-colors md:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => {
          // Placeholder for navigation/handler logic
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

export default StandingsColumn;
