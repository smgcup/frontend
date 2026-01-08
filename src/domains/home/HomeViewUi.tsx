import React from 'react';
import { HeroSection, UpcomingMatchesSection, TournamentStatistics, NewsSection } from './components';
import { Team } from '@/domains/team/contracts';
import { News as NewsType } from '../news/contracts';
import type { MatchListItem } from '@/domains/matches/contracts';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

type HomeViewUiProps = {
  teams: Team[];
  news: NewsType[];
  matches: MatchListItem[];
};

const LiveMatchBanner = ({ match }: { match: MatchListItem }) => {
  const showScore = match.score1 != null && match.score2 != null;

  return (
    <div className="border-b border-red-500/20 bg-red-500/10">
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-red-700 dark:text-red-300">
              <span className="animate-pulse">●</span> Live now
            </div>
            <div className="truncate text-sm text-foreground/90">
              {match.firstOpponent.name}
              {showScore ? ` ${match.score1}–${match.score2} ` : ' vs '}
              {match.secondOpponent.name}
            </div>
          </div>

          <Button asChild size="sm" className="shrink-0 gap-2">
            <Link href={`/matches/${match.id}`}>
              Watch <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
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
