import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { StandingsCategory } from '../contracts';
import PlayerRow from './PlayerRow';

type StandingsColumnProps = {
  category: StandingsCategory;
};

const getCategoryEmoji = (title: string) => {
  switch (title) {
    case 'Goals':
      return '⚽';
    case 'Assists':
      return '🤝';
    case 'Total Passes':
      return '👟';
    case 'Clean Sheets':
      return '🧤';
    default:
      return null;
  }
};

const StandingsColumn = ({ category }: StandingsColumnProps) => {
  const categoryEmoji = getCategoryEmoji(category.title);

  return (
    <div className="min-w-[80vw] md:min-w-0 snap-center shrink-0 md:shrink">
      <button
        type="button"
        className="group flex items-center gap-2 mb-4 cursor-pointer text-left px-2 py-1 -mx-2 -my-1 rounded-md transition-colors md:hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => {
          // Placeholder for navigation/handler logic
        }}
      >
        {categoryEmoji && <span className="text-xl leading-none">{categoryEmoji}</span>}
        <span className="text-xl font-bold">{category.title}</span>
        <span className="text-muted-foreground text-sm">&gt;</span>
      </button>

      <div className="bg-card rounded-xl overflow-hidden border">
        {category.players.map((player, index) => (
          <PlayerRow key={player.id} player={player} isLast={index === category.players.length - 1} />
        ))}
      </div>

      <div className="mt-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/players/test">View All</Link>
        </Button>
      </div>
    </div>
  );
};

export default StandingsColumn;
