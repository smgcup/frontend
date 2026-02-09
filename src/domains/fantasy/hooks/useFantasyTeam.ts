'use client';

import { useState, useCallback, useMemo } from 'react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import type { FantasyPlayer } from '../contracts';
import { getValidSwapTargets } from '../utils/formations';

type UseFantasyTeamProps = {
  initialStarters: FantasyPlayer[];
  initialBench: FantasyPlayer[];
};

export const useFantasyTeam = ({ initialStarters, initialBench }: UseFantasyTeamProps) => {
  const [starters, setStarters] = useState<FantasyPlayer[]>(initialStarters);
  const [bench, setBench] = useState<FantasyPlayer[]>(initialBench);
  const [activePlayer, setActivePlayer] = useState<FantasyPlayer | null>(null);
  const [activeIsStarter, setActiveIsStarter] = useState(false);

  const validTargets = useMemo(() => {
    if (!activePlayer) return new Set<string>();
    return getValidSwapTargets(activePlayer, activeIsStarter, starters, bench);
  }, [activePlayer, activeIsStarter, starters, bench]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const playerId = event.active.id as string;

      const starterMatch = starters.find((p) => p.id === playerId);
      if (starterMatch) {
        setActivePlayer(starterMatch);
        setActiveIsStarter(true);
        return;
      }

      const benchMatch = bench.find((p) => p.id === playerId);
      if (benchMatch) {
        setActivePlayer(benchMatch);
        setActiveIsStarter(false);
      }
    },
    [starters, bench],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActivePlayer(null);

      if (!over || active.id === over.id) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (!validTargets.has(overId)) return;

      const aInStarters = starters.findIndex((p) => p.id === activeId);
      const aInBench = bench.findIndex((p) => p.id === activeId);
      const bInStarters = starters.findIndex((p) => p.id === overId);
      const bInBench = bench.findIndex((p) => p.id === overId);

      if (aInStarters !== -1 && bInStarters !== -1) {
        // Both starters
        setStarters((prev) => {
          const next = [...prev];
          [next[aInStarters], next[bInStarters]] = [next[bInStarters], next[aInStarters]];
          return next;
        });
      } else if (aInBench !== -1 && bInBench !== -1) {
        // Both bench
        setBench((prev) => {
          const next = [...prev];
          [next[aInBench], next[bInBench]] = [next[bInBench], next[aInBench]];
          return next;
        });
      } else {
        // Cross swap
        const starterIdx = aInStarters !== -1 ? aInStarters : bInStarters;
        const benchIdx = aInBench !== -1 ? aInBench : bInBench;
        const starterPlayer = starters[starterIdx];
        const benchPlayer = bench[benchIdx];

        setStarters((prev) => {
          const next = [...prev];
          next[starterIdx] = benchPlayer;
          return next;
        });
        setBench((prev) => {
          const next = [...prev];
          next[benchIdx] = starterPlayer;
          return next;
        });
      }
    },
    [starters, bench, validTargets],
  );

  const handleDragCancel = useCallback(() => {
    setActivePlayer(null);
  }, []);

  return {
    starters,
    bench,
    activePlayer,
    validTargets,
    isDragging: activePlayer !== null,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
};
