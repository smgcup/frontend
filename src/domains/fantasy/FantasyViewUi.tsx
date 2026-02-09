'use client';

import { useEffect, useState } from 'react';
import { Calendar, DollarSign, Eye } from 'lucide-react';
import { DndContext, DragOverlay, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import type { FantasyTeamData, FantasyAvailablePlayer, PlayerCardDisplayMode } from './contracts';
import FantasyPitchCard from './components/FantasyPitchCard';
import PlayerListSidebar from './components/PlayerListSidebar';
import PlayerCard from './components/PlayerCard';
import { useFantasyTeam } from './hooks/useFantasyTeam';

type FantasyViewUiProps = {
  team: FantasyTeamData;
  availablePlayers: FantasyAvailablePlayer[];
};

const FantasyViewUi = ({ team, availablePlayers }: FantasyViewUiProps) => {
  const [displayMode, setDisplayMode] = useState<PlayerCardDisplayMode>('points');
  const [showPrice, setShowPrice] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // dnd-kit generates dynamic accessibility IDs (e.g. DndDescribedBy-0) that can differ
  // between server render and client hydration. Enable DnD only after mount to avoid
  // hydration mismatches in Next.js.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const {
    starters,
    bench,
    activePlayer,
    validTargets,
    isDragging,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useFantasyTeam({ initialStarters: team.starters, initialBench: team.bench });

  const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 5 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } });
  const sensors = useSensors(pointerSensor, touchSensor);

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
                  isDragActive={isDragging}
                />

                <DragOverlay dropAnimation={null}>
                  {activePlayer && (
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
                isDragActive={false}
                enableDnd={false}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default FantasyViewUi;
