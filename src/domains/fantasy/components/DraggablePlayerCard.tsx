'use client';

import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { FantasyPlayer, PlayerCardDisplayMode } from '../contracts';
import PlayerCard from './PlayerCard';

type DraggablePlayerCardProps = {
  player: FantasyPlayer;
  displayMode: PlayerCardDisplayMode;
  showPrice: boolean;
  compact?: boolean;
  isValidTarget: boolean;
  isDragActive: boolean;
};

const DraggablePlayerCard = ({
  player,
  displayMode,
  showPrice,
  compact,
  isValidTarget,
  isDragActive,
}: DraggablePlayerCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({ id: player.id });

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: player.id });

  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  // We render the dragged preview via <DragOverlay /> (see FantasyViewUi),
  // so we do NOT apply transforms to the original element to avoid "double" visuals.
  // (Original stays in its slot; overlay follows the pointer.)

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'transition-all duration-200 touch-none rounded-lg',
        // Hide the original while dragging so only the overlay is visible.
        isDragging && 'opacity-0',
        isDragActive &&
          !isDragging &&
          isValidTarget &&
          'animate-pulse ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]',
        isDragActive &&
          !isDragging &&
          isValidTarget &&
          isOver &&
          'scale-110 ring-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.6)]',
        isDragActive && !isDragging && !isValidTarget && 'opacity-30 grayscale',
      )}
    >
      <PlayerCard player={player} displayMode={displayMode} showPrice={showPrice} compact={compact} />
    </div>
  );
};

export default DraggablePlayerCard;
