'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MatchStatus } from '@/graphql';
import type { Match } from '@/domains/matches/contracts';

// ─── FDR Types & Helpers ────────────────────────────────────────────────

const FDR_COLORS: Record<number, string> = {
  1: 'bg-[#375523] text-white',
  2: 'bg-[#01fc7a] text-[#1a1a2e]',
  3: 'bg-[#e7e7e7] text-[#1a1a2e]',
  4: 'bg-[#ff1751] text-white',
  5: 'bg-[#80072d] text-white',
};

type FdrRow = {
  teamId: string;
  teamName: string;
  fixtures: Record<number, { opponent: string; isHome: boolean; difficulty: 1 | 2 | 3 | 4 | 5 | null } | null>;
};

type GameweekHeader = {
  number: number;
  date: string;
};

/** Build FDR table data from real matches */
const buildFdrData = (
  matchesByRound: Record<number, Match[]>,
  rounds: number[],
): { teams: FdrRow[]; gameweeks: GameweekHeader[] } => {
  const teamMap = new Map<string, string>();
  for (const round of rounds) {
    for (const match of matchesByRound[round] ?? []) {
      teamMap.set(match.firstOpponent.id, match.firstOpponent.name);
      teamMap.set(match.secondOpponent.id, match.secondOpponent.name);
    }
  }

  const gameweeks: GameweekHeader[] = rounds.map((round) => {
    const matches = matchesByRound[round] ?? [];
    const dates = matches
      .filter((m) => m.date)
      .map((m) => new Date(m.date!))
      .sort((a, b) => a.getTime() - b.getTime());

    const date = dates.length > 0 ? dates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'TBD';

    return { number: round, date };
  });

  const teams: FdrRow[] = [...teamMap.entries()]
    .sort(([, a], [, b]) => a.localeCompare(b))
    .map(([teamId, teamName]) => {
      const fixtures: FdrRow['fixtures'] = {};

      for (const round of rounds) {
        const roundMatches = matchesByRound[round] ?? [];
        const match = roundMatches.find((m) => m.firstOpponent.id === teamId || m.secondOpponent.id === teamId);

        if (!match) {
          fixtures[round] = null;
          continue;
        }

        const isHome = match.firstOpponent.id === teamId;
        const opponent = isHome ? match.secondOpponent.name : match.firstOpponent.name;

        const fdr = isHome ? match.fdr1 : match.fdr2;
        fixtures[round] = {
          opponent,
          isHome,
          difficulty: fdr != null ? (fdr as 1 | 2 | 3 | 4 | 5) : null,
        };
      }

      return { teamId, teamName, fixtures };
    });

  return { teams, gameweeks };
};

// ─── FDR Components ─────────────────────────────────────────────────────

const FdrKey = () => (
  <div className="mb-6 mx-2">
    <p className="text-sm font-bold text-white mb-2">FDR Key:</p>
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          className={cn('h-8 w-10 rounded-md flex items-center justify-center text-sm font-bold', FDR_COLORS[n])}
        >
          {n}
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between mt-1" style={{ width: 232 }}>
      <span className="text-xs text-white/50">Easy</span>
      <span className="text-xs text-white/50">Hard</span>
    </div>
  </div>
);

const FdrTable = ({ teams, gameweeks }: { teams: FdrRow[]; gameweeks: GameweekHeader[] }) => (
  <div className="mx-2 overflow-x-auto rounded-xl ring-1 ring-white/10">
    <table className="w-full border-collapse min-w-max table-fixed">
      <thead>
        <tr className="border-b border-white/10">
          <th className="sticky left-0 z-10 bg-[#0d0518] px-1 py-3 text-center text-xs font-semibold text-white/60 w-[50px] min-w-[50px] max-w-[50px] md:w-[100px] md:min-w-[100px] md:max-w-[100px]">
            Team
          </th>
          {gameweeks.map((gw) => (
            <th
              key={gw.number}
              className="px-1 py-3 text-center w-[75px] min-w-[75px] max-w-[75px] md:w-[200px] md:min-w-[200px] md:max-w-[200px]"
            >
              <div className="text-xs font-bold text-white/80">GW{gw.number}</div>
              <div className="text-[10px] text-white/40">{gw.date}</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={team.teamId} className="border-b border-white/6">
            <td className="sticky left-0 z-10 bg-[#0d0518] px-1 py-2.5 text-center text-xs font-semibold text-white w-[50px] min-w-[50px] max-w-[50px] md:w-[100px] md:min-w-[100px] md:max-w-[100px]">
              <span className="block truncate">{team.teamName}</span>
            </td>
            {gameweeks.map((gw) => {
              const fixture = team.fixtures[gw.number];
              if (!fixture) {
                return (
                  <td
                    key={gw.number}
                    className="px-1 py-1.5 w-[75px] min-w-[75px] max-w-[75px] md:w-[200px] md:min-w-[200px] md:max-w-[200px]"
                  >
                    <div className="flex h-9 items-center justify-center rounded text-xs font-medium text-white/30">
                      -
                    </div>
                  </td>
                );
              }
              return (
                <td
                  key={gw.number}
                  className="px-1 py-1.5 w-[75px] min-w-[75px] max-w-[75px] md:w-[200px] md:min-w-[200px] md:max-w-[200px]"
                >
                  <div
                    className={cn(
                      'flex h-9 items-center justify-center rounded text-xs font-bold',
                      fixture.difficulty != null ? FDR_COLORS[fixture.difficulty] : 'bg-white/8 text-white/60',
                    )}
                  >
                    <span className="truncate">{fixture.opponent}</span>
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

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
        <span className="flex-1 text-right text-base font-semibold text-white truncate">
          {match.firstOpponent.name}
        </span>

        {isFinished || isLive ? (
          <span className="shrink-0 w-14 text-center text-sm font-bold text-white tabular-nums">
            {match.score1 ?? 0} - {match.score2 ?? 0}
          </span>
        ) : (
          <span className="shrink-0 w-14 text-center text-sm font-medium text-white/30">vs</span>
        )}

        <span className="flex-1 text-left text-xl font-semibold text-white truncate">{match.secondOpponent.name}</span>
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
  const [activeTab, setActiveTab] = useState<'fixtures' | 'fdr'>('fixtures');

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

  const fmtShort = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const dateRange =
    datesInRound.length > 0
      ? datesInRound.length === 1
        ? fmtShort(datesInRound[0])
        : `${fmtShort(datesInRound[0])} – ${fmtShort(datesInRound[datesInRound.length - 1])}`
      : null;

  return (
    <div className="min-h-screen bg-[#07000f]">
      <div className={cn('mx-auto w-full px-2 pt-0 pb-24 lg:pt-4', activeTab === 'fdr' ? 'max-w-5xl' : 'max-w-2xl')}>
        {/* Title */}
        <h1 className="text-center text-xl font-extrabold text-white tracking-tight mb-4">Fixtures &amp; Results</h1>

        {/* Tab bar */}
        <div className="mx-auto mb-5 flex w-fit rounded-full bg-white/6 p-1 ring-1 ring-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('fixtures')}
            className={cn(
              'rounded-full px-5 py-1.5 text-sm font-semibold transition-colors',
              activeTab === 'fixtures' ? 'bg-white/12 text-white' : 'text-white/40 hover:text-white/60',
            )}
          >
            Fixtures
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fdr')}
            className={cn(
              'rounded-full px-5 py-1.5 text-sm font-semibold transition-colors',
              activeTab === 'fdr' ? 'bg-white/12 text-white' : 'text-white/40 hover:text-white/60',
            )}
          >
            FDR
          </button>
        </div>

        {activeTab === 'fixtures' ? (
          <>
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
                <div className="mb-5 mx-2 flex items-center justify-between rounded-2xl bg-linear-to-r from-indigo-500/55 via-violet-500/45 to-fuchsia-500/55 ring-1 ring-white/15 shadow-lg shadow-fuchsia-500/20 backdrop-blur-md px-3 py-3">
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
                    <div className="text-sm font-extrabold text-white tracking-tight">Gameweek {page}</div>
                    {dateRange && <div className="text-xs text-white/50 mt-0.5">{dateRange}</div>}
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
                        <span className="text-xs font-bold text-white/60 uppercase tracking-wider">{group.label}</span>
                      </div>
                      {group.matches.map((match) => (
                        <FixtureRow key={match.id} match={match} />
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <FdrKey />
            <FdrTable {...buildFdrData(matchesByRound, rounds)} />
          </>
        )}
      </div>
    </div>
  );
};

export default FantasyFixturesViewUi;
