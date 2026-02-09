'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, Eye, Users, ArrowLeftRight, Trophy } from 'lucide-react';
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
import PlayerCard from './components/PlayerCard';
import PlayerDetailDrawer from './components/PlayerDetailDrawer';
import { useFantasyTeam } from './hooks/useFantasyTeam';

type FantasyTab = 'pickTeam' | 'transfers' | 'points';

type FantasyViewUiProps = {
  team: FantasyTeamData;
  availablePlayers: FantasyAvailablePlayer[];
};

const FantasyViewUi = ({ team, availablePlayers }: FantasyViewUiProps) => {
  const [activeTab, setActiveTab] = useState<FantasyTab>('points');
  const [displayMode, setDisplayMode] = useState<PlayerCardDisplayMode>('points');
  const [isMounted, setIsMounted] = useState(false);
  const [gameweek, setGameweek] = useState(team.gameweek);

  const showPrice = activeTab === 'transfers';

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

  const [selectedPlayer, setSelectedPlayer] = useState<FantasyPlayer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [playerListOpen, setPlayerListOpen] = useState(false);
  const [playerListPosition, setPlayerListPosition] = useState<PlayerPosition | 'ALL'>('ALL');
  const [replacingPlayerId, setReplacingPlayerId] = useState<string | null>(null);

  const handleEmptySlotClick = useCallback((position: PlayerPosition, oldPlayerId: string) => {
    setPlayerListPosition(position);
    setReplacingPlayerId(oldPlayerId);
    setPlayerListOpen(true);
  }, []);

  const handlePlayerListSelect = useCallback(
    (incoming: FantasyAvailablePlayer) => {
      if (replacingPlayerId) {
        replacePlayer(replacingPlayerId, incoming);
      }
      setPlayerListOpen(false);
      setReplacingPlayerId(null);
    },
    [replacingPlayerId, replacePlayer],
  );

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

  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } });
  const sensors = useSensors(pointerSensor, touchSensor);

  const substitutePlayerId = isSubstituting ? (activePlayer?.id ?? null) : null;

  return (
    <div className="min-h-screen bg-[#07000f]" onClick={isSubstituting ? cancelSubstitution : undefined}>
      <div className="mx-auto w-full max-w-6xl px-2 pt-0 pb-24 lg:pt-4">
        <div className="lg:flex lg:gap-4">
          {/* Desktop player list (left) */}
          <aside className="hidden lg:block lg:w-[280px] xl:w-[320px] lg:shrink-0 h-[calc(100vh-56px)] sticky top-14">
            <PlayerList players={availablePlayers} />
          </aside>

          {/* Team card (right) */}
          <main className="flex-1 min-w-0">
            {/* Tabs: Pick Team | Transfers - full width on mobile, sticky when scrolling */}
            <div className="sticky top-[52px] z-30 -mx-2 px-0 pt-0 border-b border-white/10 mb-4 bg-[#07000f] lg:static lg:mx-0 lg:px-0 lg:pt-0 lg:pb-0 lg:bg-transparent lg:flex lg:justify-center">
              <div className="flex w-full bg-white/6 rounded-none lg:rounded-lg overflow-hidden lg:inline-flex lg:w-auto lg:gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('points')}
                  className={cn(
                    'flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all relative',
                    activeTab === 'points' ? 'text-fuchsia-400' : 'text-white/50 hover:text-white/70',
                  )}
                >
                  <Trophy className="w-4 h-4 shrink-0" />
                  Points
                  {activeTab === 'points' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('pickTeam')}
                  className={cn(
                    'flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all relative',
                    activeTab === 'pickTeam' ? 'text-fuchsia-400' : 'text-white/50 hover:text-white/70',
                  )}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  Pick Team
                  {activeTab === 'pickTeam' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-400" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('transfers')}
                  className={cn(
                    'flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all relative',
                    activeTab === 'transfers' ? 'text-fuchsia-400' : 'text-white/50 hover:text-white/70',
                  )}
                >
                  <ArrowLeftRight className="w-4 h-4 shrink-0" />
                  Transfers
                  {activeTab === 'transfers' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-fuchsia-400" />
                  )}
                </button>
              </div>
            </div>

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
            onPlayerSelect={handlePlayerListSelect}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default FantasyViewUi;
