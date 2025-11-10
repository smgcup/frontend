"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Match {
    id: string;
    team1: string;
    team2: string;
    date: string;
    time: string;
    venue?: string;
    status: 'upcoming' | 'live' | 'completed';
}

const UpcomingMatches = () => {
    // Sample data - replace with actual data from your API
    const matches: Match[] = [
        {
            id: '1',
            team1: '10A',
            team2: '10B',
            date: '2024-01-15',
            time: '14:00',
            venue: 'Main Field',
            status: 'upcoming',
        },
        {
            id: '2',
            team1: '11A',
            team2: '11B',
            date: '2024-01-16',
            time: '15:30',
            venue: 'Main Field',
            status: 'upcoming',
        },
        {
            id: '3',
            team1: '12A',
            team2: '12B',
            date: '2024-01-17',
            time: '16:00',
            venue: 'Main Field',
            status: 'upcoming',
        },
        {
            id: '4',
            team1: '9A',
            team2: '9B',
            date: '2024-01-18',
            time: '14:30',
            venue: 'Main Field',
            status: 'upcoming',
        },
    ];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
    };

    // Show only first 3 matches
    const displayedMatches = matches.slice(0, 3);
    const hasMoreMatches = matches.length > 3;

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Upcoming Matches
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Don&apos;t miss the exciting matches between the teams in the league
                        </p>
                    </div>
                    {hasMoreMatches && (
                        <div className="flex justify-center sm:justify-end">
                            <Button asChild variant="outline" size="lg">
                                <Link href="/matches">
                                    View All Matches
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedMatches.map((match) => (
                        <div
                            key={match.id}
                            className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex flex-col space-y-4">
                                {/* Teams */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 text-center">
                                        <Link
                                            href={`/teams/${match.team1.toLowerCase()}`}
                                            className="text-lg font-semibold hover:text-primary transition-colors"
                                        >
                                            {match.team1}
                                        </Link>
                                    </div>
                                    <div className="mx-4 flex-shrink-0">
                                        <span className="text-2xl font-bold text-muted-foreground">
                                            VS
                                        </span>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <Link
                                            href={`/teams/${match.team2.toLowerCase()}`}
                                            className="text-lg font-semibold hover:text-primary transition-colors"
                                        >
                                            {match.team2}
                                        </Link>
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
                                            <span>{match.venue}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="pt-2">
                                    <span
                                        className={cn(
                                            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                                            match.status === 'upcoming' &&
                                            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
                                            match.status === 'live' &&
                                            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                                            match.status === 'completed' &&
                                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        )}
                                    >
                                        {match.status === 'upcoming' && 'Upcoming'}
                                        {match.status === 'live' && 'Live'}
                                        {match.status === 'completed' && 'Completed'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {displayedMatches.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No upcoming matches scheduled at the moment.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default UpcomingMatches;