import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import pitchSvg from '@/public/icons/pitch.svg';
import type { FantasyTeamData, PlayerCardDisplayMode } from '../contracts';
import PlayerCard from './PlayerCard';

type FantasyPitchCardProps = {
  team: FantasyTeamData;
  displayMode: PlayerCardDisplayMode;
  showPrice: boolean;
};

type GameweekNavButtonProps = {
  ariaLabel: string;
  icon: LucideIcon;
};

const GameweekNavButton = ({ ariaLabel, icon: Icon }: GameweekNavButtonProps) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

const FantasyPitchCard = ({ team, displayMode, showPrice }: FantasyPitchCardProps) => {
  const gk = team.starters.filter((p) => p.position === 'GK');
  const def = team.starters.filter((p) => p.position === 'DEF');
  const mid = team.starters.filter((p) => p.position === 'MID');
  const fwd = team.starters.filter((p) => p.position === 'FWD');

  const latestPoints = team.latestPoints ?? 0;
  const averagePoints = team.averagePoints ?? 0;
  const highestPoints = team.highestPoints ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-linear-to-b from-[#1a0028] via-[#120020] to-[#07000f] ring-1 ring-white/10">
      {/* Gameweek header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-center gap-4">
          <GameweekNavButton ariaLabel="Previous gameweek" icon={ChevronLeft} />
          <div className="text-white font-extrabold text-lg tracking-tight">Gameweek {team.gameweek}</div>
          <GameweekNavButton ariaLabel="Next gameweek" icon={ChevronRight} />
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
      </div>

      {/* Pitch */}
      <div className="w-full flex flex-col items-center mt-3">
        <div className="relative w-full max-w-lg h-[440px] overflow-hidden">
          {/* Pitch background */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[625px] h-[460px]">
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
          <div className="absolute inset-0 z-10 flex flex-col justify-between py-2">
            <div className="flex justify-center gap-1">
              {gk.map((p) => (
                <PlayerCard key={p.id} player={p} displayMode={displayMode} showPrice={showPrice} />
              ))}
            </div>

            <div className="flex justify-around px-2">
              {def.map((p) => (
                <PlayerCard key={p.id} player={p} displayMode={displayMode} showPrice={showPrice} />
              ))}
            </div>

            <div className="flex justify-around px-2">
              {mid.map((p) => (
                <PlayerCard key={p.id} player={p} displayMode={displayMode} showPrice={showPrice} />
              ))}
            </div>

            <div className="flex justify-center gap-1">
              {fwd.map((p) => (
                <PlayerCard key={p.id} player={p} displayMode={displayMode} showPrice={showPrice} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bench */}
      <div className="relative z-20 -mt-6 flex justify-center px-3">
        <div className="rounded-xl backdrop-blur-[2px] bg-white/15 border border-white/20 px-4 py-3 shadow-lg">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center mb-2">
            Substitutes
          </p>
          <div className="grid grid-cols-3 gap-2 justify-items-center">
            {team.bench.map((player, i) => (
              <div key={player.id} className="flex flex-col items-center">
                <p className="text-[9px] font-bold text-white/40 mb-1">{i === 0 ? 'GKP' : `${i}.`}</p>
                <PlayerCard player={player} displayMode={displayMode} showPrice={showPrice} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="px-4 pt-5 pb-6">
        <div className="flex items-center justify-center gap-6 text-xs text-white/40">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Free Transfers:</span>
            <span className="font-bold text-white/70">{team.freeTransfers}</span>
          </div>
          <div className="w-px h-3 bg-white/15" />
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Budget:</span>
            <span className="font-bold text-cyan-300/80">
              {'£'}
              {team.budget.toFixed(1)}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyPitchCard;
