'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, DollarSign, Eye } from 'lucide-react';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { FantasyTeamData, FantasyAvailablePlayer, FantasyPlayer, PlayerCardDisplayMode } from './contracts';
import FantasyPitchCard from './components/FantasyPitchCard';
import PlayerListSidebar from './components/PlayerListSidebar';
import PlayerCard from './components/PlayerCard';
import PlayerDetailDrawer from './components/PlayerDetailDrawer';
import { useFantasyTeam } from './hooks/useFantasyTeam';

type FantasyViewUiProps = {
  team: FantasyTeamData;
  availablePlayers: FantasyAvailablePlayer[];
};

const FantasyViewUi = ({ team, availablePlayers }: FantasyViewUiProps) => {
  const [displayMode, setDisplayMode] = useState<PlayerCardDisplayMode>('points');
  const [showPrice, setShowPrice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [gameweek, setGameweek] = useState(team.gameweek);

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
  } = useFantasyTeam({ initialStarters: team.starters, initialBench: team.bench });

  const [selectedPlayer, setSelectedPlayer] = useState<FantasyPlayer | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const substitutePlayerId = isSubstituting ? activePlayer?.id ?? null : null;

  return (
    <div className="min-h-screen bg-[#07000f]">
      <div className="mx-auto w-full max-w-6xl px-2 pt-4 pb-24">
        <div className="lg:flex lg:gap-4">
          {/* Desktop player list (left) */}
          <aside className="hidden lg:block lg:w-[280px] xl:w-[320px] lg:shrink-0 h-[calc(100vh-56px)] sticky top-14">
            <PlayerListSidebar players={availablePlayers} />
          </aside>

          {/* Team card (right) */}
          <main className="flex-1 min-w-0">
            {/* Display mode toggles */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                type="button"
                onClick={() => setDisplayMode('points')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  displayMode === 'points'
                    ? 'bg-[#2b003c] text-white ring-1 ring-fuchsia-400/30'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70',
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                Points
              </button>
              <button
                type="button"
                onClick={() => setDisplayMode('nextMatch')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  displayMode === 'nextMatch'
                    ? 'bg-[#2b003c] text-white ring-1 ring-fuchsia-400/30'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70',
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                Fixtures
              </button>
              <button
                type="button"
                onClick={() => setShowPrice((v) => !v)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  showPrice
                    ? 'bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/30'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70',
                )}
              >
                <DollarSign className="w-3.5 h-3.5" />
                Prices
              </button>
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
                  gameweek={gameweek}
                  onGameweekChange={setGameweek}
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
                gameweek={gameweek}
                onGameweekChange={setGameweek}
              />
            )}
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
    </div>
  );
};

export default FantasyViewUi;
