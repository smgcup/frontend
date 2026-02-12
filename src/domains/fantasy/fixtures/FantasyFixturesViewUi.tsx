'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchStatus } from '@/graphql';
import type { Match } from '@/domains/matches/contracts';

type FantasyFixturesViewUiProps = {
  matchesByRound: Record<number, Match[]>;
  rounds: number[];
  totalRounds: number;
  currentRound: number;
  error?: string | null;
};

/** Group matches by their date (e.g. "Sat 8 Feb") */
const groupByDate = (matches: Match[]) => {
  const groups: { label: string; matches: Match[] }[] = [];
  const map = new Map<string, Match[]>();

  for (const m of matches) {
    const key = m.date
      ? new Date(m.date).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
      : 'TBD';

    if (!map.has(key)) {
      map.set(key, []);
      groups.push({ label: key, matches: map.get(key)! });
    }
    map.get(key)!.push(m);
  }

  return groups;
};

const formatKickoff = (date: string) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const getStatusLabel = (match: Match) => {
  switch (match.status) {
    case MatchStatus.Finished:
      return 'FT';
    case MatchStatus.Live:
      return 'LIVE';
    case MatchStatus.Cancelled:
      return 'PP';
    case MatchStatus.Scheduled:
      return match.date ? formatKickoff(match.date) : '-';
    default:
      return '-';
  }
};

const FixtureRow = ({ match }: { match: Match }) => {
  const isFinished = match.status === MatchStatus.Finished;
  const isLive = match.status === MatchStatus.Live;

  return (
    <div className="flex items-center gap-2 px-3 py-3 border-t border-white/6">
      {/* Status */}
      <div className="w-12 shrink-0 text-center">
        <span
          className={cn(
            'text-xs font-semibold',
            isLive && 'text-green-400',
            isFinished && 'text-white/50',
            !isLive && !isFinished && 'text-white/70',
          )}
        >
          {getStatusLabel(match)}
        </span>
      </div>

      {/* Match */}
      <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
        <span className="flex-1 text-right text-sm font-semibold text-white truncate">
          {match.firstOpponent.name}
        </span>

        {isFinished || isLive ? (
          <span className="shrink-0 w-14 text-center text-sm font-bold text-white tabular-nums">
            {match.score1 ?? 0} - {match.score2 ?? 0}
          </span>
        ) : (
          <span className="shrink-0 w-14 text-center text-sm font-medium text-white/30">
            vs
          </span>
        )}

        <span className="flex-1 text-left text-sm font-semibold text-white truncate">
          {match.secondOpponent.name}
        </span>
      </div>

      {/* Expand chevron */}
      <div className="w-8 shrink-0 flex justify-center">
        <ChevronDown className="h-4 w-4 text-white/20" />
      </div>
    </div>
  );
};

const FantasyFixturesViewUi = ({
  matchesByRound,
  rounds,
  totalRounds,
  currentRound,
  error,
}: FantasyFixturesViewUiProps) => {
  const [page, setPage] = useState(currentRound);

  const currentIndex = rounds.indexOf(page);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= rounds.length - 1;

  const goBack = () => {
    if (!isFirst) setPage(rounds[currentIndex - 1]);
  };
  const goForward = () => {
    if (!isLast) setPage(rounds[currentIndex + 1]);
  };

  const matches = matchesByRound[page] ?? [];
  const dateGroups = groupByDate(matches);

  // Compute date range for this round
  const datesInRound = matches
    .filter((m) => m.date)
    .map((m) => new Date(m.date!))
    .sort((a, b) => a.getTime() - b.getTime());

  const fmtShort = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const dateRange =
    datesInRound.length > 0
      ? datesInRound.length === 1
        ? fmtShort(datesInRound[0])
        : `${fmtShort(datesInRound[0])} – ${fmtShort(datesInRound[datesInRound.length - 1])}`
      : null;

  return (
    <div className="min-h-screen bg-[#07000f]">
      <div className="mx-auto w-full max-w-2xl px-2 pt-0 pb-24 lg:pt-4">
        {/* Title */}
        <h1 className="text-center text-xl font-extrabold text-white tracking-tight mb-4">
          Fixtures &amp; Results
        </h1>

        {/* Tab bar */}
        <div className="mx-auto mb-5 flex w-fit rounded-full bg-white/6 p-1 ring-1 ring-white/10">
          <div className="rounded-full bg-white/12 px-5 py-1.5 text-sm font-semibold text-white">
            Fixtures
          </div>
          <div className="rounded-full px-5 py-1.5 text-sm font-medium text-white/30 cursor-not-allowed">
            FDR
          </div>
        </div>

        {error && (
          <div className="mx-2 mb-4 rounded-xl bg-red-500/10 ring-1 ring-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {totalRounds === 0 ? (
          <p className="text-center text-sm text-white/40 mt-8">No fixtures available.</p>
        ) : (
          <>
            {/* Gameweek navigator */}
            <div className="mb-5 mx-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-fuchsia-600/30 ring-1 ring-white/10 px-3 py-3">
              <button
                type="button"
                aria-label="Previous round"
                disabled={isFirst}
                onClick={goBack}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                  isFirst
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white',
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="text-center">
                <div className="text-sm font-extrabold text-white tracking-tight">
                  Gameweek {page}
                </div>
                {dateRange && (
                  <div className="text-xs text-white/50 mt-0.5">{dateRange}</div>
                )}
              </div>

              <button
                type="button"
                aria-label="Next round"
                disabled={isLast}
                onClick={goForward}
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                  isLast
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 text-white',
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Fixture list */}
            <div className="mx-2 overflow-hidden rounded-xl ring-1 ring-white/10 bg-white/3">
              {dateGroups.map((group) => (
                <div key={group.label}>
                  <div className="px-4 py-2.5 bg-white/6">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
                      {group.label}
                    </span>
                  </div>
                  {group.matches.map((match) => (
                    <FixtureRow key={match.id} match={match} />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FantasyFixturesViewUi;
