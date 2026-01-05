import React from 'react';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { goalIcon, matchIcon, playerIcon, teamIcon } from '@/public/icons';
import { Team } from '@/domains/team/contracts';
import type { News } from '@/domains/news/contracts';
import { AnimatedNumber } from '@/components/motion/AnimatedNumber';
import { Reveal } from '@/components/motion/Reveal';

type Statistic = {
  id: string;
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
};

type TournamentStatisticsProps = {
  teams: Team[];
  news: News[];
};
const TournamentStatistics = ({ teams, news }: TournamentStatisticsProps) => {
  const latestNews = [...(news ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  const daysSinceLatestUpdate = latestNews
    ? Math.max(
        0,
        Math.floor((Date.now() - new Date(latestNews.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      )
    : 0;

  const overallStats: Statistic[] = [
    {
      id: 'teams',
      label: 'Teams',
      value: teams.length,
      icon: <Image src={teamIcon} alt="Team Icon" width={32} height={32} />,
      color: 'text-green-500',
    },
    {
      id: 'news',
      label: 'News Posts',
      value: news.length,
      icon: <Image src={matchIcon} alt="News Icon" width={40} height={40} />,
      color: 'text-blue-500',
    },
    {
      id: 'freshness',
      label: 'Days Since Update',
      value: daysSinceLatestUpdate,
      icon: <Image src={goalIcon} alt="Update Icon" width={32} height={32} />,
      color: 'text-purple-500',
    },
    {
      id: 'season',
      label: 'Season Status',
      value: 'Live',
      icon: <Image src={playerIcon} alt="Status Icon" width={32} height={32} />,
      color: 'text-orange-500',
    },
  ];

  // const topTeams: Team[] = [
  // 	{
  // 		id: '1',
  // 		name: '12A',
  // 		played: 11,
  // 		won: 9,
  // 		drawn: 1,
  // 		lost: 1,
  // 		goalsFor: 32,
  // 		goalsAgainst: 12,
  // 		goalDifference: 20,
  // 		points: 28,
  // 	},
  // 	{
  // 		id: '2',
  // 		name: '11A',
  // 		played: 11,
  // 		won: 8,
  // 		drawn: 1,
  // 		lost: 2,
  // 		goalsFor: 28,
  // 		goalsAgainst: 15,
  // 		goalDifference: 13,
  // 		points: 25,
  // 	},
  // 	{
  // 		id: '3',
  // 		name: '10A',
  // 		played: 11,
  // 		won: 7,
  // 		drawn: 1,
  // 		lost: 3,
  // 		goalsFor: 25,
  // 		goalsAgainst: 18,
  // 		goalDifference: 7,
  // 		points: 22,
  // 	},
  // 	{
  // 		id: '4',
  // 		name: '12B',
  // 		played: 11,
  // 		won: 6,
  // 		drawn: 1,
  // 		lost: 4,
  // 		goalsFor: 22,
  // 		goalsAgainst: 19,
  // 		goalDifference: 3,
  // 		points: 19,
  // 	},
  // 	{
  // 		id: '5',
  // 		name: '11B',
  // 		played: 11,
  // 		won: 5,
  // 		drawn: 1,
  // 		lost: 5,
  // 		goalsFor: 20,
  // 		goalsAgainst: 21,
  // 		goalDifference: -1,
  // 		points: 16,
  // 	},
  // 	{
  // 		id: '6',
  // 		name: '10B',
  // 		played: 11,
  // 		won: 5,
  // 		drawn: 0,
  // 		lost: 6,
  // 		goalsFor: 18,
  // 		goalsAgainst: 22,
  // 		goalDifference: -4,
  // 		points: 15,
  // 	},
  // 	{
  // 		id: '7',
  // 		name: '9A',
  // 		played: 11,
  // 		won: 4,
  // 		drawn: 0,
  // 		lost: 7,
  // 		goalsFor: 16,
  // 		goalsAgainst: 24,
  // 		goalDifference: -8,
  // 		points: 12,
  // 	},
  // 	{
  // 		id: '8',
  // 		name: '9B',
  // 		played: 11,
  // 		won: 3,
  // 		drawn: 1,
  // 		lost: 7,
  // 		goalsFor: 14,
  // 		goalsAgainst: 25,
  // 		goalDifference: -11,
  // 		points: 10,
  // 	},
  // 	{
  // 		id: '9',
  // 		name: '8A',
  // 		played: 11,
  // 		won: 2,
  // 		drawn: 2,
  // 		lost: 7,
  // 		goalsFor: 12,
  // 		goalsAgainst: 26,
  // 		goalDifference: -14,
  // 		points: 8,
  // 	},
  // 	{
  // 		id: '10',
  // 		name: '8B',
  // 		played: 11,
  // 		won: 2,
  // 		drawn: 0,
  // 		lost: 9,
  // 		goalsFor: 10,
  // 		goalsAgainst: 28,
  // 		goalDifference: -18,
  // 		points: 6,
  // 	},
  // 	{
  // 		id: '11',
  // 		name: '7A',
  // 		played: 11,
  // 		won: 1,
  // 		drawn: 1,
  // 		lost: 9,
  // 		goalsFor: 8,
  // 		goalsAgainst: 30,
  // 		goalDifference: -22,
  // 		points: 4,
  // 	},
  // 	{
  // 		id: '12',
  // 		name: '7B',
  // 		played: 11,
  // 		won: 0,
  // 		drawn: 2,
  // 		lost: 9,
  // 		goalsFor: 5,
  // 		goalsAgainst: 32,
  // 		goalDifference: -27,
  // 		points: 2,
  // 	},
  // ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Tournament Statistics</h2>
            <p className="mt-4 text-lg text-muted-foreground">A real-time snapshot of what&apos;s happening</p>
          </div>
        </Reveal>

        {/* Overall Stats Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {overallStats.map((stat) => (
            <Reveal key={stat.id} delayMs={60}>
              <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold tabular-nums">
                      {typeof stat.value === 'number' ? <AnimatedNumber value={stat.value} /> : stat.value}
                    </p>
                  </div>
                  <div className={cn('opacity-80', stat.color)}>{stat.icon}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="text-2xl font-bold">Teams</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...teams]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((team, idx) => (
                  <div
                    key={team.id}
                    className="group rounded-xl border bg-background/50 p-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{team.name}</div>
                      <div className="text-xs font-semibold text-muted-foreground">#{idx + 1}</div>
                    </div>
                  </div>
                ))}
              {teams.length === 0 && <div className="text-muted-foreground">No teams available.</div>}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default TournamentStatistics;
