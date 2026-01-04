'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';
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
    <div className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col space-y-4">
        {/* Teams and Score */}
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <Link
              href={`/teams/${match.team1.toLowerCase()}`}
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {match.team1}
            </Link>
            {match.status === 'completed' && match.score1 !== undefined && (
              <p className="text-2xl font-bold mt-1">{match.score1}</p>
            )}
          </div>
          <div className="mx-4 flex-shrink-0">
            {match.status === 'completed' ? (
              <span className="text-xl font-bold text-muted-foreground">-</span>
            ) : (
              <span className="text-2xl font-bold text-muted-foreground">VS</span>
            )}
          </div>
          <div className="flex-1 text-center">
            <Link
              href={`/teams/${match.team2.toLowerCase()}`}
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {match.team2}
            </Link>
            {match.status === 'completed' && match.score2 !== undefined && (
              <p className="text-2xl font-bold mt-1">{match.score2}</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t" />

        {/* Match Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(match.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{match.time}</span>
          </div>
          {match.venue && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>SMG Arena</span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="pt-2">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
              match.status === 'upcoming' && 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
              match.status === 'live' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse',
              match.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            )}
          >
            {match.status === 'upcoming' && 'Upcoming'}
            {match.status === 'live' && 'Live'}
            {match.status === 'completed' && 'Completed'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
