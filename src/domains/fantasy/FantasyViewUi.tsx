'use client';

import Image from 'next/image';
import pitchSvg from '@/public/icons/pitch.svg';
import type { FantasyTeamData } from './contracts';
import PlayerCard from './components/PlayerCard';

type FantasyViewUiProps = {
  team: FantasyTeamData;
};

const FantasyViewUi = ({ team }: FantasyViewUiProps) => {
  const gk = team.starters.filter((p) => p.position === 'GK');
  const def = team.starters.filter((p) => p.position === 'DEF');
  const mid = team.starters.filter((p) => p.position === 'MID');
  const fwd = team.starters.filter((p) => p.position === 'FWD');

  return (
    <div className="min-h-screen mb-[150px]">
      {/* Header */}
      <div className="bg-linear-to-b from-blue-200 via-blue-100 to-teal-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-teal-800/20 px-4 pt-6 pb-8">
        <div className="max-w-lg mx-auto text-center">
          <button className="bg-emerald-500 text-white font-bold text-sm px-5 py-2 rounded-md mb-3 hover:bg-emerald-600 transition-colors">
            Points/Rankings
          </button>
          <p className="text-sm text-foreground/70 mb-6">
            Gameweek {team.gameweek}: <span className="font-bold text-foreground">{team.gameweekDate}</span>
          </p>

          <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-foreground/60 mb-1">Free transfers</p>
                <p className="text-lg font-bold text-foreground">{team.freeTransfers}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Cost</p>
                <p className="text-lg font-bold text-foreground">{team.cost} pts</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Budget</p>
                <div className="inline-block bg-emerald-500 text-white font-bold text-lg px-4 py-0.5 rounded-md">
                  {team.budget}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pitch - cropped edges so field extends beyond frame */}
      <div className="px-4">
        <div className="relative w-full max-w-lg mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-[#2b0030] shadow-lg ring-1 ring-black/10 aspect-4/5">
            {/* The SVG has built-in empty padding; scale/shift so pitch touches top/bottom */}
            <div className="absolute inset-0 z-0 origin-top -translate-y-[20%] scale-y-[1.42] scale-x-[1.2]">
              <Image
                src={pitchSvg}
                alt="Football pitch"
                fill
                priority
                sizes="(max-width: 640px) 100vw, 512px"
                className="pointer-events-none select-none object-fill"
              />
            </div>

            {/* Players on pitch */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between pt-12 pb-6 px-2">
              {/* Goalkeeper row */}
              <div className="flex justify-center">
                {gk.map((p) => (
                  <PlayerCard key={p.id} player={p} />
                ))}
              </div>

              {/* Defenders row */}
              <div className="flex justify-around px-4">
                {def.map((p) => (
                  <PlayerCard key={p.id} player={p} />
                ))}
              </div>

              {/* Midfielders row */}
              <div className="flex justify-around px-4">
                {mid.map((p) => (
                  <PlayerCard key={p.id} player={p} />
                ))}
              </div>

              {/* Forwards row */}
              <div className="flex justify-center">
                {fwd.map((p) => (
                  <PlayerCard key={p.id} player={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bench */}
      <div className="bg-linear-to-b from-emerald-100/80 to-emerald-200/60 dark:from-emerald-900/20 dark:to-emerald-800/10 px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-3 gap-4">
            {team.bench.map((player, i) => (
              <div key={player.id} className="flex flex-col items-center">
                <p className="text-xs font-bold text-foreground/70 mb-2">
                  {i + 1}. {player.position}
                </p>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyViewUi;
