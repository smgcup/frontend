import Image from 'next/image';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import pitchSvg from '@/public/icons/pitch.svg';
import { PlayerPosition } from '@/graphql';
import type { FantasyTeamData, FantasyPlayer } from '../contracts';
import type { FantasyPositionCode } from '../utils/positionUtils';
import { toPositionCode } from '../utils/positionUtils';
import DraggablePlayerCard from './DraggablePlayerCard';
import PlayerCard from './PlayerCard';
import EmptySlotCard from './EmptySlotCard';

type FantasyPitchCardProps = {
  team: FantasyTeamData;
  starters: FantasyPlayer[];
  bench: FantasyPlayer[];
  showPrice: boolean;
  validTargets: Set<string>;
  isSelectionActive: boolean;
  substitutePlayerId?: string | null;
  /** Disable dnd-kit on initial SSR render to avoid hydration mismatches */
  enableDnd?: boolean;
  onPlayerClick?: (player: FantasyPlayer) => void;
  onRemovePlayer?: (playerId: string) => void;
  removedPlayerIds?: Set<string>;
  onEmptySlotClick?: (position: FantasyPositionCode, replacingPlayerId: string) => void;
  /** Fires when an empty slot is tapped on a read-only tab (e.g. Points) */
  onReadOnlyEmptySlotClick?: () => void;
  /** Inline error message displayed below the header */
  pitchError?: string | null;
  gameweek: number;
  onGameweekChange?: (gw: number) => void;
  activeTab?: 'pickTeam' | 'transfers' | 'points';
  budget?: number;
};

type GameweekNavButtonProps = {
  ariaLabel: string;
  icon: LucideIcon;
  disabled?: boolean;
  onClick?: () => void;
};

const GameweekNavButton = ({ ariaLabel, icon: Icon, disabled, onClick }: GameweekNavButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
        disabled ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white',
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

const FantasyPitchCard = ({
  team,
  starters,
  bench,
  showPrice,
  validTargets,
  isSelectionActive,
  substitutePlayerId,
  enableDnd = true,
  onPlayerClick,
  onRemovePlayer,
  removedPlayerIds,
  onEmptySlotClick,
  onReadOnlyEmptySlotClick,
  pitchError,
  gameweek,
  onGameweekChange,
  activeTab = 'pickTeam',
  budget,
}: FantasyPitchCardProps) => {
  const gk = starters.filter((p) => p.position === PlayerPosition.Goalkeeper);
  const def = starters.filter((p) => p.position === PlayerPosition.Defender);
  const mid = starters.filter((p) => p.position === PlayerPosition.Midfielder);
  const fwd = starters.filter((p) => p.position === PlayerPosition.Forward);

  const totalSlots = starters.length + bench.length;
  const selectedCount = [...starters, ...bench].filter((p) => !removedPlayerIds?.has(p.id)).length;

  const latestPoints = team.latestPoints ?? 0;
  const averagePoints = team.averagePoints ?? 0;
  const highestPoints = team.highestPoints ?? 0;

  const renderPlayer = (p: FantasyPlayer) => {
    if (removedPlayerIds?.has(p.id)) {
      const handleSlotClick = onEmptySlotClick
        ? () => onEmptySlotClick(toPositionCode(p.position), p.id)
        : onReadOnlyEmptySlotClick;
      return (
        <div key={p.id} className="cursor-pointer" onClick={handleSlotClick}>
          <EmptySlotCard position={p.position} />
        </div>
      );
    }

    return enableDnd ? (
      <DraggablePlayerCard
        key={p.id}
        player={p}
        showPrice={showPrice}
        isValidTarget={validTargets.has(p.id)}
        isSelectionActive={isSelectionActive}
        isSubstituteSource={p.id === substitutePlayerId}
        onPlayerClick={onPlayerClick}
        onPriceClose={onRemovePlayer}
      />
    ) : (
      <div key={p.id} className="cursor-pointer" onClick={() => onPlayerClick?.(p)}>
        <PlayerCard
          player={p}
          showPrice={showPrice}
          onPriceClose={onRemovePlayer ? () => onRemovePlayer(p.id) : undefined}
        />
      </div>
    );
  };

  return (
    <div className=" max-w-lg mx-auto overflow-hidden rounded-2xl bg-linear-to-b from-[#1a0028] via-[#120020] to-[#1a0028] ring-1 ring-white/10">
      {/* Header: gameweek+stats on Points tab, free transfers/budget on other tabs */}
      <div className="px-4 pt-5 pb-3">
        {activeTab === 'points' ? (
          <>
            <div className="flex items-center justify-center gap-4">
              <GameweekNavButton
                ariaLabel="Previous gameweek"
                icon={ChevronLeft}
                disabled={gameweek <= 1}
                onClick={() => onGameweekChange?.(gameweek - 1)}
              />
              <div className="text-white font-extrabold text-lg tracking-tight">Gameweek {gameweek}</div>
              <GameweekNavButton
                ariaLabel="Next gameweek"
                icon={ChevronRight}
                disabled={gameweek >= 10}
                onClick={() => onGameweekChange?.(gameweek + 1)}
              />
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 items-center gap-3">
              <div className="text-center">
                <div className="text-white text-2xl font-extrabold leading-none">{averagePoints}</div>
                <div className="mt-1 text-[11px] font-medium text-white/50">Average</div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-[120px] overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(139,92,246,0.25)] ring-1 ring-white/20 text-center">
                  <div className="px-3 pt-3 pb-2 bg-linear-to-br from-cyan-400 to-fuchsia-500">
                    <div className="text-[44px] font-black leading-none text-[#1a0028]">{latestPoints}</div>
                    <div className="mt-0.5 text-[11px] font-semibold text-[#1a0028]/70">Total Pts</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-white text-2xl font-extrabold leading-none">{highestPoints}</div>
                <div className="mt-1 text-[11px] font-medium text-white/50">Highest</div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-white font-extrabold text-xl tracking-tight">
              {activeTab === 'pickTeam' ? 'Pick Team' : 'Transfers'}
            </h2>
            <div className="grid grid-cols-4 w-full">
              <div className="flex flex-col items-center px-2">
                <div className="h-9 flex items-center justify-center">
                  <span className="rounded-md bg-cyan-400 px-2.5 py-1 text-base font-extrabold text-[#1a0028]">
                    {selectedCount} / {totalSlots}
                  </span>
                </div>
                <span className="mt-1.5 text-[10px] font-medium text-white/40 text-center">Players Selected</span>
              </div>
              <div className="flex flex-col items-center px-2 border-l border-white/10">
                <div className="h-9 flex items-center justify-center">
                  <span className="rounded-md bg-cyan-400 px-2.5 py-1 text-base font-extrabold text-[#1a0028]">
                    {'£'}
                    {(budget ?? team.budget).toFixed(1)}m
                  </span>
                </div>
                <span className="mt-1.5 text-[10px] font-medium text-white/40 text-center">Budget</span>
              </div>
              <div className="flex flex-col items-center px-2 border-l border-white/10">
                <div className="h-9 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-white">{team.freeTransfers}</span>
                </div>
                <span className="mt-1.5 text-[10px] font-medium text-white/40 text-center">Free Transfers</span>
              </div>
              <div className="flex flex-col items-center px-2 border-l border-white/10">
                <div className="h-9 flex items-center justify-center">
                  <span className="text-xl font-extrabold text-white">{team.transferCost} pts</span>
                </div>
                <span className="mt-1.5 text-[10px] font-medium text-white/40 text-center">Cost</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Inline error (e.g. tapping empty slot on Points tab) */}
      {pitchError && (
        <div className="mx-4 mb-1 flex items-center gap-2 rounded-lg bg-red-500/15 border border-red-500/25 px-3 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs font-medium text-red-300">{pitchError}</p>
        </div>
      )}

      {/* Pitch */}
      <div className="w-full flex flex-col items-center mt-3">
        <div className="relative w-full max-w-lg h-[440px] overflow-hidden">
          {/* Pitch background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[625px] h-[440px]">
              <Image
                src={pitchSvg || '/placeholder.svg'}
                alt="Football pitch"
                fill
                priority
                className="pointer-events-none select-none object-contain object-top"
              />
            </div>
          </div>

          {/* Players on pitch */}
          <div className="absolute inset-0 z-10 my-2 flex flex-col justify-between">
            <div className="flex justify-center gap-1">{gk.map((p) => renderPlayer(p))}</div>
            <div className="flex justify-around px-2">{def.map((p) => renderPlayer(p))}</div>
            <div className="flex justify-around px-2">{mid.map((p) => renderPlayer(p))}</div>
            <div className="flex justify-around px-2">{fwd.map((p) => renderPlayer(p))}</div>
          </div>
        </div>
      </div>

      {/* Bench */}
      <div className="mt-2 relative z-20 flex justify-center px-3">
        <div className="rounded-xl backdrop-blur-[2px] bg-white/15 border border-white/20 px-6 sm:px-4 py-3 shadow-lg">
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {bench.map((player) => (
              <div key={player.id} className="flex flex-col items-center">
                <p className="text-[9px] font-bold text-white/40 mb-1">{toPositionCode(player.position)}</p>
                {renderPlayer(player)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyPitchCard;
