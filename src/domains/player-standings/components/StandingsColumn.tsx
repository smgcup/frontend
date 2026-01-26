import React from 'react';
import type { StandingsCategory } from '../contracts';
import PlayerRow from './PlayerRow';
import { CATEGORIES, CategoryType } from '../constants';

type StandingsColumnProps = {
  category: StandingsCategory;
};

const getCategoryEmoji = (category: CategoryType) => {
  switch (category) {
    case CATEGORIES.Goals:
      return '⚽';
    case CATEGORIES.Assists:
      return '🤝';
    case CATEGORIES.CleanSheets:
      return '🧤';
    case CATEGORIES.RedCards:
      return '🟥';
    case CATEGORIES.YellowCards:
      return '🟨';
    default:
      return null;
  }
};

const StandingsColumn = ({ category }: StandingsColumnProps) => {
  const categoryEmoji = getCategoryEmoji(category.title);

  return (
    <div className="min-w-[80vw] md:min-w-0 snap-center shrink-0 md:shrink">
      <div className="flex items-center gap-2 mb-4 px-2 py-1 -mx-2 -my-1">
        {categoryEmoji && <span className="text-xl leading-none">{categoryEmoji}</span>}
        <span className="text-xl font-bold">{category.title}</span>
      </div>

      <div className="bg-card rounded-xl overflow-hidden border">
        {category.players.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No players</div>
        ) : (
          category.players.map((player, index) => (
            <PlayerRow key={player.id} player={player} isLast={index === category.players.length - 1} />
          ))
        )}
      </div>
    </div>
  );
};

export default StandingsColumn;
