// ─── Fantasy Main UI Orchestrator ──────────────────────────────────────
// This is the primary UI component for the fantasy team management page.
// It wires together: tabs, pitch, drag-and-drop, player detail drawer,
// player list/grid for transfers, and display mode toggling.
//
// ARCHITECTURE NOTES:
// - Team state (starters, bench, captain, swaps) lives in useFantasyTeam hook
// - This component manages UI-only state (which tab, which drawer is open, etc.)
// - Player selection for transfers has two UIs:
//     Desktop (lg+): PlayerCardGrid shown as a persistent left sidebar
//     Mobile (<lg): PlayerList shown in a bottom Drawer on demand
//
// TODO: This component is fairly large. Consider extracting:
// - The transfer flow (replacement logic, drawer/grid wiring) into a custom hook
// - The DndContext wrapper into its own component
// - Tab-specific header content into sub-components
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, Eye, Users, ArrowLeftRight, Trophy } from 'lucide-react';
import type { FantasyTabItem } from './components/FantasyTabs';
import FantasyTabs from './components/FantasyTabs';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import type {
  FantasyTeamData,
  FantasyAvailablePlayer,
  FantasyPlayer,
  PlayerCardDisplayMode,
  PlayerPosition,
} from './contracts';
import FantasyPitchCard from './components/FantasyPitchCard';
import PlayerList from './components/PlayerList';
import PlayerCardGrid from './components/PlayerCardGrid';
import PlayerCard from './components/PlayerCard';
import PlayerDetailDrawer from './components/PlayerDetailDrawer';
import { useFantasyTeam } from './hooks/useFantasyTeam';

type FantasyTab = 'pickTeam' | 'transfers' | 'points';

const fantasyTabs: FantasyTabItem<FantasyTab>[] = [
  { id: 'points', label: 'Points', icon: Trophy },
  { id: 'pickTeam', label: 'Pick Team', icon: Users },
  { id: 'transfers', label: 'Transfers', icon: ArrowLeftRight },
];

type FantasyViewUiProps = {
  team: FantasyTeamData;
  availablePlayers: FantasyAvailablePlayer[];
};

const FantasyViewUi = ({ team, availablePlayers }: FantasyViewUiProps) => {
  const [activeTab, setActiveTab] = useState<FantasyTab>('points');
  const [displayMode, setDisplayMode] = useState<PlayerCardDisplayMode>('points');
  // isMounted: DndContext can't render during SSR (hydration mismatch).
  // We render a static pitch first, then swap in the DndContext version after mount.
  const [isMounted, setIsMounted] = useState(false);
  const [gameweek, setGameweek] = useState(team.gameweek);

  // Price badges (with X to remove) only show on the Transfers tab
  const showPrice = activeTab === 'transfers';

  // Delay mount flag by one rAF so the initial SSR render is static (no DndContext)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const {
    starters,
    bench,
    activePlayer,
    validTargets,
    isSelectionActive,
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
    removedPlayerIds,
  } = useFantasyTeam({ initialStarters: team.starters, initialBench: team.bench });

  // ── Player Detail Drawer state ──
  const [selectedPlayer, setSelectedPlayer] = useState<FantasyPlayer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Transfer Replacement state ──
  // playerListOpen: controls the mobile bottom Drawer for player selection
  // playerListPosition: which position filter is active (locked when replacing a specific slot)
  // replacingPlayerId: the ID of the player being replaced (null when not in replacement flow)
  const [playerListOpen, setPlayerListOpen] = useState(false);
  const [playerListPosition, setPlayerListPosition] = useState<PlayerPosition | 'ALL'>('ALL');
  const [replacingPlayerId, setReplacingPlayerId] = useState<string | null>(null);

  // When replacing, lock the position filter so user can only pick the same position
  const lockedPosition =
    replacingPlayerId && playerListPosition !== 'ALL' ? (playerListPosition as PlayerPosition) : undefined;

  // Called when user clicks an EmptySlotCard (a slot where a player was removed).
  // Opens the player list filtered to the required position so user can pick a replacement.
  // On desktop, the PlayerCardGrid sidebar reacts to the position filter automatically.
  // On mobile, we explicitly open the bottom Drawer.
  const handleEmptySlotClick = useCallback((position: PlayerPosition, oldPlayerId: string) => {
    setPlayerListPosition(position);
    setReplacingPlayerId(oldPlayerId);
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) {
      setPlayerListOpen(true);
    }
  }, []);

  // Called when user picks a player from PlayerList/PlayerCardGrid to fill a removed slot.
  // Triggers the actual replacement in useFantasyTeam and resets the replacement UI state.
  const handlePlayerListSelect = useCallback(
    (incoming: FantasyAvailablePlayer) => {
      if (replacingPlayerId) {
        replacePlayer(replacingPlayerId, incoming);
      }
      setPlayerListOpen(false);
      setPlayerListPosition('ALL');
      setReplacingPlayerId(null);
    },
    [replacingPlayerId, replacePlayer],
  );

  // Clicking a player has two behaviors:
  // 1. During substitution mode: complete the swap (or cancel if invalid)
  // 2. Normal mode: open the PlayerDetailDrawer
  const handlePlayerClick = useCallback(
    (player: FantasyPlayer) => {
      if (isSubstituting) {
        handleSubstitutionClick(player);
        return;
      }
      setSelectedPlayer(player);
      setDrawerOpen(true);
    },
    [isSubstituting, handleSubstitutionClick],
  );

  const handleSetCaptain = useCallback(
    (playerId: string) => {
      setCaptain(playerId);
      setSelectedPlayer((prev) => (prev ? { ...prev, isCaptain: prev.id === playerId } : null));
      setDrawerOpen(false);
    },
    [setCaptain],
  );

  const handleSubstitute = useCallback(
    (player: FantasyPlayer) => {
      setDrawerOpen(false);
      startSubstitution(player);
    },
    [startSubstitution],
  );

  // dnd-kit sensors: pointer needs 5px distance to distinguish click from drag;
  // touch needs 150ms delay so scrolling doesn't accidentally start a drag.
  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } });
  const sensors = useSensors(pointerSensor, touchSensor);

  const substitutePlayerId = isSubstituting ? (activePlayer?.id ?? null) : null;

  return (
    <div className="min-h-screen bg-[#07000f]" onClick={isSubstituting ? cancelSubstitution : undefined}>
      <div className="mx-auto w-full max-w-7xl px-2 pt-0 pb-24 lg:pt-4">
        <div className="lg:flex lg:gap-4">
          {/* Desktop player card grid (left) */}
          <aside className="hidden lg:block lg:flex-1 min-w-0 h-[calc(100vh-72px)] sticky top-[72px] overflow-y-auto hide-scrollbar">
            <PlayerCardGrid
              players={availablePlayers}
              initialPositionFilter={playerListPosition}
              lockedPosition={lockedPosition}
              onPlayerSelect={replacingPlayerId ? handlePlayerListSelect : undefined}
            />
          </aside>

          <main className="lg:w-[480px] lg:shrink-0">
            <FantasyTabs<FantasyTab> tabs={fantasyTabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {isMounted ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <FantasyPitchCard
                  team={team}
                  starters={starters}
                  bench={bench}
                  displayMode={displayMode}
                  showPrice={showPrice}
                  validTargets={validTargets}
                  isSelectionActive={isSelectionActive}
                  substitutePlayerId={substitutePlayerId}
                  onPlayerClick={handlePlayerClick}
                  onRemovePlayer={activeTab === 'transfers' ? removePlayer : undefined}
                  removedPlayerIds={activeTab === 'transfers' ? removedPlayerIds : undefined}
                  onEmptySlotClick={handleEmptySlotClick}
                  gameweek={gameweek}
                  onGameweekChange={setGameweek}
                  activeTab={activeTab}
                />

                <DragOverlay dropAnimation={null}>
                  {activePlayer && !isSubstituting && (
                    <PlayerCard player={activePlayer} displayMode={displayMode} showPrice={showPrice} />
                  )}
                </DragOverlay>
              </DndContext>
            ) : (
              <FantasyPitchCard
                team={team}
                starters={starters}
                bench={bench}
                displayMode={displayMode}
                showPrice={showPrice}
                validTargets={new Set()}
                isSelectionActive={false}
                enableDnd={false}
                onPlayerClick={handlePlayerClick}
                onRemovePlayer={activeTab === 'transfers' ? removePlayer : undefined}
                removedPlayerIds={activeTab === 'transfers' ? removedPlayerIds : undefined}
                onEmptySlotClick={handleEmptySlotClick}
                gameweek={gameweek}
                onGameweekChange={setGameweek}
                activeTab={activeTab}
              />
            )}

            {/* Toggle: Points ↔ Fixtures */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setDisplayMode((m) => (m === 'points' ? 'nextMatch' : 'points'))}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  'bg-white/10 text-white hover:bg-white/20',
                )}
              >
                {displayMode === 'points' ? (
                  <>
                    <Calendar className="w-4 h-4" />
                    Show Fixtures
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Points
                  </>
                )}
              </button>
            </div>
          </main>
        </div>
      </div>

      <PlayerDetailDrawer
        player={selectedPlayer}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSetCaptain={handleSetCaptain}
        onSubstitute={handleSubstitute}
      />

      <Drawer open={playerListOpen} onOpenChange={setPlayerListOpen}>
        <DrawerContent
          side="bottom"
          className="bg-linear-to-b from-[#1a0028] to-[#07000f] border-white/10 border-t h-[70vh] flex flex-col"
        >
          <DrawerTitle className="sr-only">Player List</DrawerTitle>
          <DrawerDescription className="sr-only">Select a player to add to your team</DrawerDescription>
          <PlayerList
            players={availablePlayers}
            initialPositionFilter={playerListPosition}
            lockedPosition={lockedPosition}
            onPlayerSelect={handlePlayerListSelect}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FantasyViewUi;
