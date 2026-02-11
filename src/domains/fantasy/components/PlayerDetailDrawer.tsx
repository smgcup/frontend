// ─── PlayerDetailDrawer ────────────────────────────────────────────────
// A responsive drawer showing detailed player info when a player card is tapped.
// Opens from the bottom on mobile, from the right on desktop (lg+).
//
// SECTIONS:
// 1. Player header: avatar (image or JerseyIcon fallback), name, team, position, captain badge
// 2. Stat pills: price, pts/match, selected-by percentage
// 3. Form: last N match results with color-coded point badges (green/amber/red)
// 4. Fixtures: upcoming opponents with formatted date/time
// 5. Action buttons: Make Captain, Full Profile (TODO: not wired), Substitute
//
// TODO: "Full Profile" button has no handler – wire it to a player profile page/modal.
'use client';

import { Shield, TrendingUp, Users, Crown, ArrowRightLeft, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import type { FantasyPlayer } from '../contracts';
import { toPositionLabel } from '../utils/positionUtils';
import JerseyIcon from './JerseyIcon';

type PlayerDetailDrawerProps = {
  player: FantasyPlayer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetCaptain?: (playerId: string) => void;
  onSubstitute?: (player: FantasyPlayer) => void;
};

const monthMap: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

/** Convert "Sat 14 Dec 15:00" → "14.12 15:00" */
const formatFixtureDateTime = (dateTime: string): string => {
  const parts = dateTime.split(' ');
  if (parts.length < 4) return dateTime;
  const [, day, month, time] = parts;
  const mm = monthMap[month];
  if (!mm) return dateTime;
  return `${day.padStart(2, '0')}.${mm} at ${time}`;
};

const PlayerDetailDrawer = ({ player, open, onOpenChange, onSetCaptain, onSubstitute }: PlayerDetailDrawerProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const side = isDesktop ? 'right' : 'bottom';

  if (!player) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        side={side}
        className={cn(
          'bg-linear-to-b from-[#1a0028] to-[#07000f] border-white/10',
          side === 'bottom' ? 'border-t pb-safe' : 'border-l overflow-y-auto',
        )}
      >
        {/* Visually hidden title for accessibility */}
        <DrawerTitle className="sr-only">{player.displayName} Details</DrawerTitle>
        <DrawerDescription className="sr-only">Player details and stats</DrawerDescription>

        <div className={cn('px-5 pb-6', side === 'right' ? 'pt-5' : 'pt-1')}>
          {/* Player header */}
          <div className="flex items-center gap-4">
            {/* Player avatar area */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {player.imageUrl ? (
                  <Image src={player.imageUrl} alt={player.displayName} fill className="object-cover" />
                ) : (
                  <JerseyIcon
                    color={player.jersey.color}
                    textColor={player.jersey.textColor}
                    label={player.jersey.label}
                    size={48}
                  />
                )}
              </div>
              {player.isCaptain && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-linear-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-[9px] font-black text-[#1a0028]">
                  C
                </div>
              )}
            </div>

            {/* Name & position */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg leading-tight truncate">{player.displayName}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-cyan-300">{player.teamShort ?? '—'}</span>
                <span className="text-white/30 text-xs">|</span>
                <span className="text-xs text-white/50">{toPositionLabel(player.position)}</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatPill
              icon={<TrendingUp className="w-3 h-3 text-cyan-300" />}
              label="Price"
              value={player.price != null ? `£${player.price.toFixed(1)}m` : '—'}
            />
            <StatPill
              icon={<Shield className="w-3 h-3 text-fuchsia-300" />}
              label="Pts/Match"
              value={player.ptsPerMatch != null ? player.ptsPerMatch.toFixed(1) : '—'}
            />
            <StatPill
              icon={<Users className="w-3 h-3 text-emerald-300" />}
              label="Selected"
              value={player.selectedBy != null ? `${player.selectedBy}%` : '—'}
            />
          </div>

          {/* Form & Fixtures */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* Form */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Form</h4>
              {player.form && player.form.length > 0 ? (
                <div className="space-y-1.5">
                  {player.form.map((m, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{m.opponent}</span>
                      <span
                        className={cn(
                          'text-xs font-bold min-w-[28px] text-center rounded-md px-1.5 py-0.5',
                          m.points >= 8
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : m.points >= 4
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-red-500/20 text-red-300',
                        )}
                      >
                        {m.points}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/30">No data</p>
              )}
            </div>

            {/* Fixtures */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-3">
              <h4 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Fixtures</h4>
              {player.fixtures && player.fixtures.length > 0 ? (
                <div className="space-y-1.5">
                  {player.fixtures.map((f, i) => (
                    <div key={i}>
                      <span className="text-xs font-semibold text-white">{f.opponent}</span>
                      {f.dateTime && (
                        <span className="ml-1.5 inline-block text-[10px] font-medium text-white/50 bg-white/8 rounded px-1.5 py-0.5">
                          {formatFixtureDateTime(f.dateTime)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-white/30">No data</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-5 space-y-2">
            {/* Make captain */}
            <button
              type="button"
              onClick={() => {
                if (!player.isCaptain) {
                  onSetCaptain?.(player.id);
                }
              }}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
                player.isCaptain
                  ? 'bg-linear-to-r from-cyan-400 to-fuchsia-500 text-[#1a0028]'
                  : 'bg-white/10 text-white hover:bg-white/15 border border-white/10',
              )}
            >
              <Crown className="w-4 h-4" />
              {player.isCaptain ? 'Captain' : 'Make Captain'}
            </button>

            {/* Bottom row: Full Profile + Substitute */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 transition-all"
              >
                <User className="w-3.5 h-3.5" />
                Full Profile
              </button>
              <button
                type="button"
                onClick={() => onSubstitute?.(player)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 border border-cyan-400/20 transition-all"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Substitute
              </button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type StatPillProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const StatPill = ({ icon, label, value }: StatPillProps) => (
  <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 border border-white/10 py-2.5 px-2">
    {icon}
    <span className="text-sm font-bold text-white">{value}</span>
    <span className="text-[10px] text-white/40">{label}</span>
  </div>
);

export default PlayerDetailDrawer;
