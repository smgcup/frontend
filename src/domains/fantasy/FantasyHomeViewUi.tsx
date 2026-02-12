'use client';

import Link from 'next/link';
import { ChevronRight, Users, ArrowLeftRight } from 'lucide-react';
import type { FantasyHomeData } from './contracts';
import { useCountdown } from './hooks/useCountdown';

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('bg-BG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Sofia',
  }).format(date);

type FantasyHomeViewUiProps = {
  data: FantasyHomeData;
};

const FantasyHomeViewUi = ({ data }: FantasyHomeViewUiProps) => {
  const countdown = useCountdown(data.nextDeadline);

  return (
    <div className="min-h-screen bg-[#07000f] pb-24">
      <div className="mx-auto max-w-lg">
        {/* ── Gradient Hero Section ── */}
        <div className="relative overflow-hidden md:rounded-lg bg-linear-to-br from-cyan-500 via-indigo-500 to-fuchsia-700 px-5 pt-6 pb-8">
          {/* Subtle overlay for depth */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/5 to-black/10" />

          <div className="relative">
            {/* Team name + manager + arrow */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white">{data.teamName ?? 'My Team'}</h1>
                {data.managerName && <p className="mt-0.5 text-sm font-medium text-white/70">{data.managerName}</p>}
              </div>
              <Link
                href="/games/fantasy/my-team"
                aria-label="View team"
                className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-white/20" />

            {/* Current Gameweek label */}
            <p className="text-center text-sm font-medium text-white/60">Gameweek {data.currentGameweek}</p>

            {/* Stats row: Average / Points / Highest */}
            <div className="mt-4 grid grid-cols-3 items-end text-center">
              <div>
                <p className="text-4xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {data.averagePoints ?? '-'}
                </p>
                <p className="mt-1 text-xs font-medium text-white/50">Average</p>
              </div>
              <Link href="/games/fantasy/my-team" className="block">
                <p className="text-6xl font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
                  {data.currentGameweekPoints ?? '-'}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-white/60 transition-colors hover:text-white/80">
                  Points <ChevronRight className="h-3 w-3" />
                </p>
              </Link>
              <Link href="#" className="block">
                <p className="text-4xl font-black text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {data.highestPoints ?? '-'}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/50 transition-colors hover:text-white/70">
                  Highest <ChevronRight className="h-3 w-3" />
                </p>
              </Link>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-white/20" />

            {/* Next Gameweek + Deadline */}
            <div className="text-center">
              <p className="text-sm font-medium text-white/60">Gameweek {data.nextGameweek}</p>
              <p className="mt-1 text-base font-bold text-white">Deadline: {formatDate(data.nextDeadline)}</p>
            </div>

            {/* Countdown */}
            {countdown.isExpired ? (
              <p className="mt-4 text-center text-sm font-semibold text-white/80">Deadline has passed</p>
            ) : (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[
                  { value: countdown.days, label: 'Days' },
                  { value: countdown.hours, label: 'Hrs' },
                  { value: countdown.minutes, label: 'Mins' },
                  { value: countdown.seconds, label: 'Secs' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-black/20 backdrop-blur-sm py-2.5 text-center">
                    <p className="text-xl font-extrabold tabular-nums text-white">{item.value}</p>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">{item.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons – pill-shaped */}
            <div className="mt-6 space-y-3">
              <Link
                href="/games/fantasy/my-team?tab=pickTeam"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-white/15 backdrop-blur-sm px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/25"
              >
                <Users className="h-4 w-4" />
                Pick Team
              </Link>
              <Link
                href="/games/fantasy/my-team?tab=transfers"
                className="flex w-full items-center justify-center gap-2.5 rounded-full bg-white/15 backdrop-blur-sm px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/25"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Transfers
              </Link>
            </div>
          </div>
        </div>

        {/* ── Quick Links Card ── */}
        <div className="mx-4 mt-5 divide-y divide-white/8 overflow-hidden rounded-2xl bg-white/4 ring-1 ring-white/10">
          {[
            { label: 'Fixtures', href: '#' },
            { label: 'Fixture Difficulty Rating', href: '#' },
            { label: 'Player Statistics', href: '#' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between px-5 py-4 text-sm font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white/90"
            >
              {link.label}
              <ChevronRight className="h-4 w-4 text-white/30" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FantasyHomeViewUi;
