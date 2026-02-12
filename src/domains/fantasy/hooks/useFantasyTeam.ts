'use client';

import { useState, useCallback, useMemo } from 'react';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import type { FantasyPlayer, FantasyAvailablePlayer, JerseyStyle } from '../contracts';
import { getValidSwapTargets } from '../utils/formations';

const teamJerseys: Record<string, JerseyStyle> = {
  LIV: { color: '#C8102E', textColor: '#FFFFFF', label: '' },
  MCI: { color: '#6CABDD', textColor: '#1C2C5B', label: '' },
  ARS: { color: '#EF0107', textColor: '#FFFFFF', label: '' },
  CHE: { color: '#034694', textColor: '#FFFFFF', label: '' },
  TOT: { color: '#FFFFFF', textColor: '#132257', label: '' },
  AVL: { color: '#670E36', textColor: '#95BFE5', label: '' },
  NEW: { color: '#241F20', textColor: '#FFFFFF', label: '' },
  BAY: { color: '#DC052D', textColor: '#FFFFFF', label: '' },
  RMA: { color: '#FEBE10', textColor: '#00529F', label: '' },
  PSG: { color: '#004170', textColor: '#FFFFFF', label: '' },
  MIA: { color: '#F7B5CD', textColor: '#231F20', label: '' },
  ATM: { color: '#CB3524', textColor: '#FFFFFF', label: '' },
};

const defaultJersey: JerseyStyle = { color: '#4B5563', textColor: '#FFFFFF', label: '' };

const getTeamJersey = (teamShort?: string): JerseyStyle =>
  teamShort ? (teamJerseys[teamShort] ?? defaultJersey) : defaultJersey;

type UseFantasyTeamProps = {
  initialStarters: FantasyPlayer[];
  initialBench: FantasyPlayer[];
  initialRemovedPlayerIds?: Set<string>;
};

export const useFantasyTeam = ({ initialStarters, initialBench, initialRemovedPlayerIds }: UseFantasyTeamProps) => {
  const [starters, setStarters] = useState<FantasyPlayer[]>(initialStarters);
  const [bench, setBench] = useState<FantasyPlayer[]>(initialBench);
  // activePlayer: the player currently being dragged or chosen for substitution
  const [activePlayer, setActivePlayer] = useState<FantasyPlayer | null>(null);
  const [activeIsStarter, setActiveIsStarter] = useState(false);
  const [isSubstituting, setIsSubstituting] = useState(false);
  // removedPlayerIds: tracks which players have been "removed" in Transfers tab
  // (they show as EmptySlotCards on the pitch until replaced)
  const [removedPlayerIds, setRemovedPlayerIds] = useState<Set<string>>(initialRemovedPlayerIds ?? new Set());

  const validTargets = useMemo(() => {
    if (!activePlayer) return new Set<string>();
    return getValidSwapTargets(activePlayer, activeIsStarter, starters, bench);
  }, [activePlayer, activeIsStarter, starters, bench]);

  // ── Shared swap logic ──────────────────────────────────────────────
  // Handles all three swap cases: starter↔starter, bench↔bench, starter↔bench.
  // Captain badge transfers to the incoming player if the captain moves to bench.

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

        // If the captain is being sent to bench, transfer the badge to the incoming player
        const captainMovingToBench = starterPlayer.isCaptain;

        setStarters((prev) => {
          const next = [...prev];
          next[starterIdx] = captainMovingToBench ? { ...benchPlayer, isCaptain: true } : benchPlayer;
          return next;
        });
        setBench((prev) => {
          const next = [...prev];
          next[benchIdx] = captainMovingToBench ? { ...starterPlayer, isCaptain: false } : starterPlayer;
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
    const update = (players: FantasyPlayer[]) => players.map((p) => ({ ...p, isCaptain: p.id === playerId }));
    setStarters(update);
    setBench(update);
  }, []);

  // ── Transfer removal & replacement ────────────────────────────────
  // Flow: removePlayer marks a player → EmptySlotCard renders → user picks
  // a replacement → replacePlayer swaps in the new player and un-marks the slot.
  // TODO: Enforce budget constraints when replacing (check incoming.price <= budget + old.price)

  const removePlayer = useCallback(
    (playerId: string) => {
      const removedPlayer = starters.find((p) => p.id === playerId) ?? bench.find((p) => p.id === playerId);

      if (removedPlayer?.isCaptain) {
        const newCaptain =
          starters.find((p) => p.id !== playerId && !removedPlayerIds.has(p.id)) ??
          bench.find((p) => p.id !== playerId && !removedPlayerIds.has(p.id));
        if (newCaptain) {
          setCaptain(newCaptain.id);
        }
      }

      setRemovedPlayerIds((prev) => new Set(prev).add(playerId));
    },
    [starters, bench, removedPlayerIds, setCaptain],
  );

  const replacePlayer = useCallback(
    (oldPlayerId: string, incoming: FantasyAvailablePlayer) => {
      const oldInStarters = starters.find((p) => p.id === oldPlayerId);
      const oldPlayer = oldInStarters ?? bench.find((p) => p.id === oldPlayerId);
      if (!oldPlayer) return;

      // Enforce fixed roster composition: replacement must be same position
      if (incoming.position !== oldPlayer.position) return;

      const hasCaptain = [...starters, ...bench].some((p) => p.isCaptain && !removedPlayerIds.has(p.id));

      const newPlayer: FantasyPlayer = {
        ...incoming,
        displayName: incoming.displayName,
        jersey: getTeamJersey(incoming.teamShort),
        isCaptain: !hasCaptain,
      };

      const replaceIn = (players: FantasyPlayer[]) => players.map((p) => (p.id === oldPlayerId ? newPlayer : p));

      if (oldInStarters) {
        setStarters(replaceIn);
      } else {
        setBench(replaceIn);
      }

      setRemovedPlayerIds((prev) => {
        const next = new Set(prev);
        next.delete(oldPlayerId);
        return next;
      });
    },
    [starters, bench, removedPlayerIds],
  );

  return {
    starters,
    bench,
    removedPlayerIds,
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
    removePlayer,
    replacePlayer,
  };
};
