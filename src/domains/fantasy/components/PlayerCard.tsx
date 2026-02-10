// ─── PlayerCard ────────────────────────────────────────────────────────
// A single player card shown on the pitch. Purely presentational.
// Layout from top to bottom:
//   1. Price badge overlay (only on Transfers tab when showPrice=true)
//      - Has an X button that triggers onPriceClose (removes the player)
//   2. Captain badge (top-right "C" circle, shifts down when price badge is shown)
//   3. Jersey area (JerseyIcon SVG with the player's colors and number)
//   4. Name bar (white background, player name)
//   5. Bottom bar: either points (purple bg) or next match (gray bg)
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
};

const PlayerCard = ({ player, displayMode = 'points', showPrice = false, onPriceClose }: PlayerCardProps) => {
  // Show next match text only if we're in nextMatch mode AND the player has data; otherwise fall back to points
  const showNextMatch = displayMode === 'nextMatch' && !!player.nextMatch;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-lg overflow-hidden shrink-0 select-none',
        'backdrop-blur-[2px] border border-white/20 shadow-lg',
        'w-[72px] h-[100px]',
        fantasyTheme.bgLight,
      )}
    >
      {/* Price badge overlay */}
      {showPrice && player.price != null && (
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center gap-1 py-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPriceClose?.();
            }}
            className="flex items-center justify-center w-4 h-4 rounded-full bg-[#37003c] shrink-0"
            aria-label="Hide price"
          >
            <X className="w-2.5 h-2.5 text-white/80" />
          </button>
          <span className="text-[11px] font-bold text-white">
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
      <div className={cn('flex-1 flex items-center justify-center', 'py-1.5', showPrice && 'pt-4')}>
        <JerseyIcon
          color={player.jersey.color}
          textColor={player.jersey.textColor}
          label={player.jersey.label}
          size={showPrice ? 42 : 52}
        />
      </div>

      {/* Name bar */}
      <div className="bg-white px-1 py-0.5 flex items-center justify-center min-h-[18px]">
        <span className="text-[10px] font-bold text-gray-900 text-center truncate w-full leading-tight">
          {player.name}
        </span>
      </div>

      {/* Bottom bar: next match text OR points (with captain ×2 badge) */}
      {showNextMatch ? (
        <div className="flex items-center justify-center py-0.5 min-h-[18px] bg-gray-100">
          <span className="text-[10px] font-semibold text-gray-700 truncate px-1">{player.nextMatch}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1 py-0.5 min-h-[18px] bg-[#2b003c] text-white">
          <span className="text-[11px] font-bold">{player.points}</span>
          {player.isCaptain && (
            <span className="text-[9px] font-black bg-linear-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent leading-none">
              ×2
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
