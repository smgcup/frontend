'use client';

import { useRef } from 'react';
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
  isSelectionActive: boolean;
  isSubstituteSource?: boolean;
  onPlayerClick?: (player: FantasyPlayer) => void;
};

const DraggablePlayerCard = ({
  player,
  displayMode,
  showPrice,
  compact,
  isValidTarget,
  isSelectionActive,
  isSubstituteSource,
  onPlayerClick,
}: DraggablePlayerCardProps) => {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id: player.id });
  const wasDragging = useRef(false);

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: player.id });

  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  // Track drag state so we can distinguish click from drag.
  if (isDragging) wasDragging.current = true;

  const handleClick = () => {
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    onPlayerClick?.(player);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={cn(
        'transition-all duration-200 touch-none rounded-lg cursor-pointer',
        isDragging && 'opacity-0',
        isSubstituteSource && 'ring-2 ring-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
        isSelectionActive &&
          !isDragging &&
          !isSubstituteSource &&
          isValidTarget &&
          'animate-pulse ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]',
        isSelectionActive &&
          !isDragging &&
          !isSubstituteSource &&
          isValidTarget &&
          isOver &&
          'scale-110 ring-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.6)]',
        isSelectionActive && !isDragging && !isValidTarget && !isSubstituteSource && 'opacity-30 grayscale',
      )}
    >
      <PlayerCard player={player} displayMode={displayMode} showPrice={showPrice} compact={compact} />
    </div>
  );
};

export default DraggablePlayerCard;
