'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fantasyTheme } from '@/lib/gamemodeThemes';
import pitchSvg from '@/public/icons/pitch.svg';
import type { FantasyTeamData } from './contracts';
import PlayerCard from './components/PlayerCard';

type FantasyViewUiProps = {
  team: FantasyTeamData;
};

type GameweekNavButtonProps = {
  ariaLabel: string;
  icon: LucideIcon;
};

const GameweekNavButton = ({ ariaLabel, icon: Icon }: GameweekNavButtonProps) => {
  return (
    <button
      aria-label={ariaLabel}
      className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

const FantasyViewUi = ({ team }: FantasyViewUiProps) => {
  const gk = team.starters.filter((p) => p.position === 'GK');
  const def = team.starters.filter((p) => p.position === 'DEF');
  const mid = team.starters.filter((p) => p.position === 'MID');
  const fwd = team.starters.filter((p) => p.position === 'FWD');

  const latestPoints = team.latestPoints ?? 0;
  const averagePoints = team.averagePoints ?? 0;
  const highestPoints = team.highestPoints ?? 0;

  return (
    <div className="min-h-screen pb-24 bg-black px-2">
      <div className="mx-auto w-full pt-6 max-w-lg">
        <div className={cn('overflow-hidden rounded-2xl', fantasyTheme.bg)}>
          {/* Top header (inside same card) */}
          <div className="px-4 pt-4 pb-3">
            <div className="mt-4 flex items-center justify-center gap-4">
              <GameweekNavButton ariaLabel="Previous gameweek" icon={ChevronLeft} />
              <div className="text-white font-extrabold text-lg">Gameweek {team.gameweek}</div>
              <GameweekNavButton ariaLabel="Next gameweek" icon={ChevronRight} />
            </div>

            <div className="mt-4 grid grid-cols-3 items-center gap-3">
              <div className="text-center">
                <div className="text-white text-3xl font-extrabold leading-none">{averagePoints}</div>
                <div className="mt-1 text-xs font-medium text-white/60">Average Points</div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-[140px] overflow-hidden rounded-2xl shadow-[0_16px_35px_rgba(0,0,0,0.35)] ring-1 ring-white/25 text-center">
                  <div className="px-4 pt-4 pb-3 bg-linear-to-br from-cyan-300 to-indigo-500">
                    <div className="text-[56px] font-black leading-none text-[#2a003d]">{latestPoints}</div>
                    <div className="mt-1 text-[13px] font-semibold text-[#2a003d]/75">Total Pts</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-white text-3xl font-extrabold leading-none">{highestPoints}</div>
                <div className="mt-1 text-xs font-medium text-white/60">
                  Highest Points <span className="text-white/80">→</span>
                </div>
              </div>
            </div>
          </div>
          {/* Pitch (same card) */}
          {/* Centers the pitch area within the card */}
          <div className="w-full flex flex-col items-center mt-4">
            {/* Fixed-height container that establishes the positioning context for the pitch + player overlays */}
            <div className="relative w-full max-w-lg h-[460px] overflow-hidden">
              {/* Background layer for the pitch image (kept behind players via z-index) */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Pitch SVG: center top / 625px 460px (no-repeat) */}
                {/* Pitch image wrapper: pins the SVG to the top-center with a specific render size */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[625px] h-[460px]">
                  {/* Actual pitch SVG image; non-interactive so clicks go to player cards */}
                  <Image
                    src={pitchSvg}
                    alt="Football pitch"
                    fill
                    priority
                    className="pointer-events-none select-none object-contain object-top"
                  />
                </div>
              </div>

              {/* Players on pitch */}
              <div className="absolute inset-0 z-10 flex flex-col justify-between">
                <div className="flex justify-center">
                  {gk.map((p) => (
                    <PlayerCard key={p.id} player={p} />
                  ))}
                </div>

                <div className="flex justify-around px-4">
                  {def.map((p) => (
                    <PlayerCard key={p.id} player={p} />
                  ))}
                </div>

                <div className="flex justify-around px-4">
                  {mid.map((p) => (
                    <PlayerCard key={p.id} player={p} />
                  ))}
                </div>

                <div className="flex justify-center">
                  {fwd.map((p) => (
                    <PlayerCard key={p.id} player={p} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Bench (same card) */}
          <div className="relative z-20 -mt-12 px-4">
            <div className={cn('mx-auto max-w-lg rounded-2xl backdrop-blur-md px-4 py-3', fantasyTheme.bgLight)}>
              <div className="grid grid-cols-4 gap-3">
                {team.bench.map((player, i) => (
                  <div key={player.id} className="flex flex-col items-center">
                    <p className="text-xs font-extrabold text-muted-foreground mb-2">
                      {i === 0 ? 'GKP' : `${i}. ${player.position}`}
                    </p>
                    <PlayerCard player={player} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Title below bench (like the screenshot) */}
          <div className="px-4 pt-6 pb-8">
            <h2 className="text-white text-2xl font-extrabold text-center">Substitutes</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyViewUi;
