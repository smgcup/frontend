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
  const [isSubstituting, setIsSubstituting] = useState(false);

  const validTargets = useMemo(() => {
    if (!activePlayer) return new Set<string>();
    return getValidSwapTargets(activePlayer, activeIsStarter, starters, bench);
  }, [activePlayer, activeIsStarter, starters, bench]);

  // ── Shared swap logic ──────────────────────────────────────────────

  const performSwap = useCallback(
    (playerAId: string, playerBId: string) => {
      const aInStarters = starters.findIndex((p) => p.id === playerAId);
      const aInBench = bench.findIndex((p) => p.id === playerAId);
      const bInStarters = starters.findIndex((p) => p.id === playerBId);
      const bInBench = bench.findIndex((p) => p.id === playerBId);

      if (aInStarters !== -1 && bInStarters !== -1) {
        setStarters((prev) => {
          const next = [...prev];
          [next[aInStarters], next[bInStarters]] = [next[bInStarters], next[aInStarters]];
          return next;
        });
      } else if (aInBench !== -1 && bInBench !== -1) {
        setBench((prev) => {
          const next = [...prev];
          [next[aInBench], next[bInBench]] = [next[bInBench], next[aInBench]];
          return next;
        });
      } else {
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
    [starters, bench],
  );

  // ── Drag handlers ──────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setIsSubstituting(false);
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
      const overId = over.id as string;
      if (!validTargets.has(overId)) return;

      performSwap(active.id as string, overId);
    },
    [validTargets, performSwap],
  );

  const handleDragCancel = useCallback(() => {
    setActivePlayer(null);
    setIsSubstituting(false);
  }, []);

  // ── Substitute mode ────────────────────────────────────────────────

  const startSubstitution = useCallback(
    (player: FantasyPlayer) => {
      const isStarter = starters.some((p) => p.id === player.id);
      setActivePlayer(player);
      setActiveIsStarter(isStarter);
      setIsSubstituting(true);
    },
    [starters],
  );

  const cancelSubstitution = useCallback(() => {
    setActivePlayer(null);
    setIsSubstituting(false);
  }, []);

  const handleSubstitutionClick = useCallback(
    (clickedPlayer: FantasyPlayer) => {
      if (!activePlayer || !isSubstituting) return;

      if (clickedPlayer.id === activePlayer.id || !validTargets.has(clickedPlayer.id)) {
        cancelSubstitution();
        return;
      }

      performSwap(activePlayer.id, clickedPlayer.id);
      cancelSubstitution();
    },
    [activePlayer, isSubstituting, validTargets, performSwap, cancelSubstitution],
  );

  // ── Captain ────────────────────────────────────────────────────────

  const setCaptain = useCallback((playerId: string) => {
    const update = (players: FantasyPlayer[]) =>
      players.map((p) => ({ ...p, isCaptain: p.id === playerId }));
    setStarters(update);
    setBench(update);
  }, []);

  return {
    starters,
    bench,
    activePlayer,
    validTargets,
    isSelectionActive: activePlayer !== null,
    isSubstituting,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
    setCaptain,
    startSubstitution,
    handleSubstitutionClick,
    cancelSubstitution,
  };
};
