import React from 'react';
import type { StandingsCategory } from '../contracts';
import PlayerRow from './PlayerRow';

type StandingsColumnProps = {
  category: StandingsCategory;
};

const StandingsColumn = ({ category }: StandingsColumnProps) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden border">
      {category.players.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No players</div>
      ) : (
        category.players.map((player, index) => (
          <PlayerRow key={player.id} player={player} isLast={index === category.players.length - 1} />
        ))
      )}
    </div>
  );
};

export default StandingsColumn;
