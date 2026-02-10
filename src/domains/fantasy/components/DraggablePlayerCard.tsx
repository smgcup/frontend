// ─── DraggablePlayerCard ───────────────────────────────────────────────
// Wraps PlayerCard with dnd-kit drag AND drop capabilities.
// Each card is both draggable (you can pick it up) and droppable (you can
// drop another card onto it to swap).
//
// VISUAL FEEDBACK during drag/substitution:
// - isDragging: card becomes invisible (opacity-0) since DragOverlay shows the ghost
// - isSubstituteSource: fuchsia ring glow (the player being substituted)
// - isValidTarget: cyan ring glow (valid swap destinations)
// - isOver + isValidTarget: scaled up with brighter glow (hovering over a valid target)
// - !isValidTarget when selection active: dimmed + grayscale (can't swap here)
//
// CLICK vs DRAG distinction: uses wasDragging ref to suppress click after a drag ends.
'use client';

import { useRef, useEffect } from 'react';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { FantasyPlayer } from '../contracts';
import PlayerCard from './PlayerCard';

type DraggablePlayerCardProps = {
  player: FantasyPlayer;
  showPrice: boolean;
  isValidTarget: boolean;
  isSelectionActive: boolean;
  isSubstituteSource?: boolean;
  onPlayerClick?: (player: FantasyPlayer) => void;
  onPriceClose?: (playerId: string) => void;
};

const DraggablePlayerCard = ({
  player,
  showPrice,
  isValidTarget,
  isSelectionActive,
  isSubstituteSource,
  onPlayerClick,
  onPriceClose,
}: DraggablePlayerCardProps) => {
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id: player.id });
  const wasDragging = useRef(false);

  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: player.id });

  const setNodeRef = (node: HTMLElement | null) => {
    setDragRef(node);
    setDropRef(node);
  };

  // Track drag state so we can distinguish click from drag.
  useEffect(() => {
    if (isDragging) {
      wasDragging.current = true;
    }
  }, [isDragging]);

  const handleClick = (e: React.MouseEvent) => {
    if (wasDragging.current) {
      wasDragging.current = false;
      return;
    }
    e.stopPropagation();
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
        isDragging && 'opacity-0 transition-none',
        isSubstituteSource && 'ring-2 ring-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.4)]',
        isSelectionActive &&
          !isDragging &&
          !isSubstituteSource &&
          isValidTarget &&
          'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]',
        isSelectionActive &&
          !isDragging &&
          !isSubstituteSource &&
          isValidTarget &&
          isOver &&
          'scale-110 ring-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.6)]',
        isSelectionActive && !isDragging && !isValidTarget && !isSubstituteSource && 'opacity-30 grayscale',
      )}
    >
      <PlayerCard
        player={player}
        showPrice={showPrice}
        onPriceClose={onPriceClose ? () => onPriceClose(player.id) : undefined}
      />
    </div>
  );
};

export default DraggablePlayerCard;
