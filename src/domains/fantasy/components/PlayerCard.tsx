'use client';

import { cn } from '@/lib/utils';
import { fantasyTheme } from '@/lib/gamemodeThemes';
import type { FantasyPlayer, PlayerCardDisplayMode } from '../contracts';
import JerseyIcon from './JerseyIcon';
import { X } from 'lucide-react';

type PlayerCardProps = {
  player: FantasyPlayer;
  /** Which info to show in the bottom bar – defaults to "points" */
  displayMode?: PlayerCardDisplayMode;
  /** Whether to show the price badge overlay at the top */
  showPrice?: boolean;
  /** Callback when the price badge close button is clicked */
  onPriceClose?: () => void;
  /** Optional: compact mode used on bench */
  compact?: boolean;
};

const PlayerCard = ({
  player,
  displayMode = 'points',
  showPrice = false,
  onPriceClose,
  compact = false,
}: PlayerCardProps) => {
  const showPointsMode = displayMode === 'points';
  const showNextMatchMode = displayMode === 'nextMatch' && !!player.nextMatch;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg overflow-hidden shrink-0',
        'backdrop-blur-[2px] border border-white/20 shadow-lg',
        compact ? 'w-[62px]' : 'w-[72px]',
        fantasyTheme.bgLight,
      )}
    >
      {/* Price badge overlay */}
      {showPrice && player.price != null && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-1 py-0.5 bg-black/60 backdrop-blur-sm">
          {onPriceClose && (
            <button
              type="button"
              onClick={onPriceClose}
              className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              aria-label="Hide price"
            >
              <X className="w-2 h-2 text-white" />
            </button>
          )}
          <span className="text-[10px] font-bold text-cyan-300">
            {'£'}
            {player.price.toFixed(1)}m
          </span>
        </div>
      )}

      {/* Captain badge */}
      {player.isCaptain && (
        <div
          className={cn(
            'absolute z-20 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white border border-white/50 shadow-md',
            showPrice ? 'top-5 right-0.5' : 'top-0.5 right-0.5',
            fantasyTheme.bg,
          )}
        >
          C
        </div>
      )}

      {/* Jersey area */}
      <div className={cn('flex items-center justify-center', compact ? 'py-1' : 'py-1.5', showPrice && 'pt-4')}>
        <JerseyIcon
          color={player.jersey.color}
          textColor={player.jersey.textColor}
          label={player.jersey.label}
          size={showPrice ? 42 : compact ? 44 : 52}
        />
      </div>

      {/* Name bar */}
      <div className="bg-white px-1 py-0.5 flex items-center justify-center min-h-[18px]">
        <span className="text-[10px] font-bold text-gray-900 text-center truncate w-full leading-tight">
          {player.name}
        </span>
      </div>

      {/* Bottom bar: points OR next match */}
      {showPointsMode && (
        <div className={cn('flex items-center justify-center py-0.5 min-h-[18px]', 'bg-[#2b003c] text-white')}>
          <span className="text-[11px] font-bold">{player.points}</span>
        </div>
      )}

      {showNextMatchMode && (
        <div className="flex items-center justify-center py-0.5 min-h-[18px] bg-gray-100">
          <span className="text-[10px] font-semibold text-gray-700 truncate px-1">{player.nextMatch}</span>
        </div>
      )}

      {/* Fallback: if nextMatch mode but no match data, show points */}
      {displayMode === 'nextMatch' && !player.nextMatch && (
        <div className={cn('flex items-center justify-center py-0.5 min-h-[18px]', 'bg-[#2b003c] text-white')}>
          <span className="text-[11px] font-bold">{player.points}</span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
