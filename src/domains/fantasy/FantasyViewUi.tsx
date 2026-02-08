'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, RotateCw, Star } from 'lucide-react';
import pitchSvg from '@/public/icons/pitch.svg';
import type { FantasyTeamData } from './contracts';
import PlayerCard from './components/PlayerCard';

type FantasyViewUiProps = {
  team: FantasyTeamData;
};

const formatNumber = (value?: number) => (typeof value === 'number' ? value.toLocaleString() : '—');

const FantasyViewUi = ({ team }: FantasyViewUiProps) => {
  const gk = team.starters.filter((p) => p.position === 'GK');
  const def = team.starters.filter((p) => p.position === 'DEF');
  const mid = team.starters.filter((p) => p.position === 'MID');
  const fwd = team.starters.filter((p) => p.position === 'FWD');

  const latestPoints = team.latestPoints ?? 0;
  const averagePoints = team.averagePoints ?? 0;
  const highestPoints = team.highestPoints ?? 0;
  const gwRank = team.gwRank;
  const transfers = team.transfers ?? team.freeTransfers;

  return (
    <div className="min-h-screen pb-24 bg-linear-to-b from-[#2b0030] via-[#1d0021] to-[#120014]">
      <div className="mx-auto w-full max-w-3xl pt-6 mb-[150px]">
        <div className="overflow-hidden rounded-2xl bg-[#37003c] shadow-[0_20px_60px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          {/* Top header (inside same card) */}
          <div className="px-4 pt-4 pb-3">
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                aria-label="Previous gameweek"
                className="h-8 w-8 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="text-white font-extrabold text-lg">Gameweek {team.gameweek}</div>
              <button
                aria-label="Next gameweek"
                className="h-8 w-8 rounded-full bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 items-center gap-3">
              <div className="text-center">
                <div className="text-white text-3xl font-extrabold leading-none">{formatNumber(averagePoints)}</div>
                <div className="mt-1 text-xs font-medium text-white/60">Average Points</div>

                <div className="my-3 h-px bg-white/10" />

                <div className="text-white text-3xl font-extrabold leading-none">{formatNumber(highestPoints)}</div>
                <div className="mt-1 text-xs font-medium text-white/60">
                  Highest Points <span className="text-white/80">→</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-[92px] rounded-xl bg-linear-to-b from-sky-300 to-sky-100 text-[#37003c] shadow-[0_16px_35px_rgba(0,0,0,0.35)] ring-1 ring-white/25 text-center">
                  <div className="pt-3 text-[44px] font-black leading-none">{latestPoints}</div>
                  <div className="mt-1 text-[11px] font-semibold text-[#37003c]/70">Latest Points</div>
                  <div className="mt-2 pb-2 flex items-center justify-center">
                    <RotateCw className="h-4 w-4 text-[#37003c]/60" />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-white text-3xl font-extrabold leading-none">{formatNumber(gwRank)}</div>
                <div className="mt-1 text-xs font-medium text-white/60">GW Rank</div>

                <div className="my-3 h-px bg-white/10" />

                <div className="text-white text-3xl font-extrabold leading-none">{formatNumber(transfers)}</div>
                <div className="mt-1 text-xs font-medium text-white/60">
                  Transfers <span className="text-white/80">→</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-white/85 hover:text-white transition-colors">
                <Star className="h-4 w-4" />
                Team of the Week <span className="text-white/80">→</span>
              </button>
            </div>
          </div>

          {/* Pitch (same card) */}
          <div className="px-1 mt-2 w-full flex flex-col items-center">
            <div className="relative w-full max-w-lg h-[460px] overflow-hidden">
              <div className="absolute inset-0 z-0 overflow-hidden bg-red-500">
                {/* Pitch SVG: center top / 625px 460px (no-repeat) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[625px] h-[460px]">
                  <Image
                    src={pitchSvg}
                    alt="Football pitch"
                    fill
                    priority
                    className="pointer-events-none select-none object-contain object-top"
                  />
                </div>

                {/* Fade into the card background near bottom (like FPL) */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent via-[#37003c]/10 to-[#37003c]/70" />
              </div>

              {/* Players on pitch */}
              <div className="absolute inset-0 z-10 flex flex-col justify-between px-2 pb-36">
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
          <div className="relative z-20 -mt-24 px-4">
            <div className="mx-auto max-w-lg rounded-2xl bg-white/18 ring-1 ring-white/15 backdrop-blur-md px-4 py-3">
              <div className="grid grid-cols-4 gap-3">
                {team.bench.map((player, i) => (
                  <div key={player.id} className="flex flex-col items-center">
                    <p className="text-xs font-extrabold text-[#0b0b0b]/60 mb-2">
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
