'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Users, ArrowLeftRight, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
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
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import type { FantasyTeamData, FantasyAvailablePlayer, FantasyPlayer } from './contracts';
import type { FantasyPositionCode } from './utils/positionUtils';
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
  // isMounted: DndContext can't render during SSR (hydration mismatch).
  // We render a static pitch first, then swap in the DndContext version after mount.
  const [isMounted, setIsMounted] = useState(false);
  const [gameweek, setGameweek] = useState(team.gameweek);
  const pitchCardRef = useRef<HTMLDivElement | null>(null);
  const [pitchCardHeight, setPitchCardHeight] = useState<number | null>(null);

  // Price badges (with X to remove) only show on the Transfers tab
  const showPrice = activeTab === 'transfers';

  // Delay mount flag by one rAF so the initial SSR render is static (no DndContext)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Desktop-only: keep the left player list the same height as the pitch card.
  useEffect(() => {
    const el = pitchCardRef.current;
    if (!el) return;

    const update = () => setPitchCardHeight(el.getBoundingClientRect().height);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
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
  } = useFantasyTeam({
    initialStarters: team.starters,
    initialBench: team.bench,
    initialRemovedPlayerIds: team.initialRemovedPlayerIds,
  });

  // ── Player Detail Drawer state ──
  const [selectedPlayer, setSelectedPlayer] = useState<FantasyPlayer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // ── Transfer Replacement state ──
  // playerListOpen: controls the mobile bottom Drawer for player selection
  // playerListPosition: which position filter is active (locked when replacing a specific slot)
  // replacingPlayerId: the ID of the player being replaced (null when not in replacement flow)
  const [playerListOpen, setPlayerListOpen] = useState(false);
  const [playerListPosition, setPlayerListPosition] = useState<FantasyPositionCode | 'ALL'>('ALL');
  const [replacingPlayerId, setReplacingPlayerId] = useState<string | null>(null);

  // When replacing, lock the position filter so user can only pick the same position
  const lockedPosition =
    replacingPlayerId && playerListPosition !== 'ALL' ? (playerListPosition as FantasyPositionCode) : undefined;

  // Called when user clicks an EmptySlotCard (a slot where a player was removed).
  // Opens the player list filtered to the required position so user can pick a replacement.
  // On desktop, the PlayerCardGrid sidebar reacts to the position filter automatically.
  // On mobile, we explicitly open the bottom Drawer.
  const handleEmptySlotClick = useCallback((position: FantasyPositionCode, oldPlayerId: string) => {
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

  // Desktop-only: make the left player list obviously scrollable (gradient + hint)
  const desktopListRef = useRef<HTMLDivElement | null>(null);
  const [desktopListScroll, setDesktopListScroll] = useState({
    canScroll: false,
    atTop: true,
    atBottom: true,
  });

  useEffect(() => {
    const el = desktopListRef.current;
    if (!el) return;

    const update = () => {
      const canScroll = el.scrollHeight > el.clientHeight + 4;
      const atTop = el.scrollTop <= 2;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      setDesktopListScroll({ canScroll, atTop, atBottom });
    };

    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [availablePlayers.length, playerListPosition, lockedPosition, pitchCardHeight]);

  return (
    <div className="min-h-screen bg-[#07000f]" onClick={isSubstituting ? cancelSubstitution : undefined}>
      <div className="mx-auto w-full max-w-7xl px-2 pt-0 pb-24 lg:pt-4">
        <div className="lg:flex lg:gap-12">
          {/* Desktop player card grid (left) */}
          <aside className="hidden lg:block lg:flex-1 min-w-0 h-[calc(100vh-72px)] sticky top-[72px]">
            <div ref={desktopListRef} className="h-full overflow-y-auto hide-scrollbar pb-14">
              <PlayerCardGrid
                players={availablePlayers}
                initialPositionFilter={playerListPosition}
                lockedPosition={lockedPosition}
                onPlayerSelect={replacingPlayerId ? handlePlayerListSelect : undefined}
              />
            </div>

            {/* Scroll affordance overlays (desktop only) */}
            {desktopListScroll.canScroll && !desktopListScroll.atTop && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-[#07000f] to-transparent" />
            )}
            {desktopListScroll.canScroll && !desktopListScroll.atBottom && (
              <>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#07000f] via-[#07000f]/80 to-transparent" />
                {desktopListScroll.atTop && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center">
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                      <ChevronDown className="h-4 w-4" />
                      <span>Scroll</span>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </>
            )}
            {desktopListScroll.canScroll && !desktopListScroll.atTop && (
              <div className="pointer-events-none absolute inset-x-0 top-3 flex items-center justify-center">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/60 backdrop-blur-sm">
                  <ChevronUp className="h-4 w-4" />
                  <span>More above</span>
                  <ChevronUp className="h-4 w-4" />
                </div>
              </div>
            )}
          </aside>

          <main className="lg:w-[480px] lg:shrink-0">
            <FantasyTabs<FantasyTab> tabs={fantasyTabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <div ref={pitchCardRef}>
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
                    showPrice={showPrice}
                    validTargets={validTargets}
                    isSelectionActive={isSelectionActive}
                    substitutePlayerId={substitutePlayerId}
                    onPlayerClick={handlePlayerClick}
                    onRemovePlayer={activeTab === 'transfers' ? removePlayer : undefined}
                    removedPlayerIds={removedPlayerIds}
                    onEmptySlotClick={handleEmptySlotClick}
                    gameweek={gameweek}
                    onGameweekChange={setGameweek}
                    activeTab={activeTab}
                  />

                  <DragOverlay dropAnimation={null}>
                    {activePlayer && !isSubstituting && <PlayerCard player={activePlayer} showPrice={showPrice} />}
                  </DragOverlay>
                </DndContext>
              ) : (
                <FantasyPitchCard
                  team={team}
                  starters={starters}
                  bench={bench}
                  showPrice={showPrice}
                  validTargets={new Set()}
                  isSelectionActive={false}
                  enableDnd={false}
                  onPlayerClick={handlePlayerClick}
                  onRemovePlayer={activeTab === 'transfers' ? removePlayer : undefined}
                  removedPlayerIds={removedPlayerIds}
                  onEmptySlotClick={handleEmptySlotClick}
                  gameweek={gameweek}
                  onGameweekChange={setGameweek}
                  activeTab={activeTab}
                />
              )}
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
