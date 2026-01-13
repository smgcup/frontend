import React from 'react';
import { HeroSection, UpcomingMatchesSection, TournamentStatistics, NewsSection } from './components';
import { Team } from '@/domains/team/contracts';
import { News as NewsType } from '../news/contracts';
import type { Match } from '@/domains/matches/contracts';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

type HomeViewUiProps = {
  teams: Team[];
  news: NewsType[];
  matches: Match[];
};

const LiveMatchBanner = ({ match }: { match: Match }) => {
  const showScore = match.score1 != null && match.score2 != null;

  return (
    <Link
      href={`/matches/${match.id}`}
      className="block border-b border-red-500/20 bg-red-500/10 transition-colors hover:bg-red-500/15 cursor-pointer"
    >
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-700 dark:border-red-500/30 dark:text-red-300">
                <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-red-600 dark:bg-red-400" />
                Live now
              </span>
              <div className="min-w-0 truncate text-sm font-semibold text-foreground lg:text-base">
                {match.firstOpponent.name}
                {showScore ? ` ${match.score1}–${match.score2} ` : ' vs '}
                {match.secondOpponent.name}
              </div>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            className="shrink-0 gap-2 border-transparent bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 pointer-events-none"
          >
            Watch <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

const HomeViewUi = ({ teams, news, matches }: HomeViewUiProps) => {
  const liveMatches = matches.filter((m) => m.status === 'LIVE').slice(0, 2);

  return (
    <>
      {liveMatches.map((match) => (
        <LiveMatchBanner key={match.id} match={match} />
      ))}
      <HeroSection />
      <UpcomingMatchesSection matches={matches} />
      <TournamentStatistics teams={teams} />
      <NewsSection news={news} />
    </>
  );
};

export default HomeViewUi;
