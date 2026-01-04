'use client';

import type React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Match = {
  id: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue?: string;
  status: 'upcoming' | 'live' | 'completed';
  score1?: number;
  score2?: number;
  round: number;
};

type MatchCardProps = {
  match: Match;
};

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6 flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Trophy className="h-3.5 w-3.5" />
            <span>Round {match.round}</span>
          </div>
          {/* Status Badge */}
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
              match.status === 'upcoming' && 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
              match.status === 'live' && 'bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse',
              match.status === 'completed' && 'bg-green-500/10 text-green-600 dark:text-green-400',
            )}
          >
            {match.status === 'upcoming' && 'Upcoming'}
            {match.status === 'live' && '● Live'}
            {match.status === 'completed' && 'Completed'}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Link href={`/teams/${match.team1.toLowerCase()}`} className="block text-center group/team">
              <div className="text-2xl font-bold tracking-tight group-hover/team:text-primary transition-colors">
                {match.team1}
              </div>
              {match.status === 'completed' && match.score1 !== undefined && (
                <div className="text-3xl font-black mt-2 text-primary">{match.score1}</div>
              )}
            </Link>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            {match.status === 'completed' ? (
              <span className="text-2xl font-bold text-muted-foreground/30">—</span>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                  <span className="relative text-3xl font-black text-primary">VS</span>
                </div>
              </>
            )}
          </div>

          <div className="flex-1">
            <Link href={`/teams/${match.team2.toLowerCase()}`} className="block text-center group/team">
              <div className="text-2xl font-bold tracking-tight group-hover/team:text-primary transition-colors">
                {match.team2}
              </div>
              {match.status === 'completed' && match.score2 !== undefined && (
                <div className="text-3xl font-black mt-2 text-primary">{match.score2}</div>
              )}
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t space-y-2.5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span className="font-medium">{formatDate(match.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary/70" />
            <span className="font-medium">{match.time}</span>
          </div>
          {match.venue && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span className="font-medium">SMG Arena</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
