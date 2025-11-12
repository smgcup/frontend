"use client";

import React, { useState, useMemo } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import matchIcon from '../../../public/match-icon.svg';

interface Match {
    id: string;
    team1: string;
    team2: string;
    date: string;
    time: string;
    venue?: string;
    status: 'upcoming' | 'live' | 'completed';
    score1?: number;
    score2?: number;
}

// Sample data - replace with actual API call
const sampleMatches: Match[] = [
    { id: '1', team1: '10A', team2: '10B', date: '2024-01-15', time: '14:00', venue: 'Main Field', status: 'completed', score1: 3, score2: 1 },
    { id: '2', team1: '11A', team2: '11B', date: '2024-01-16', time: '15:30', venue: 'Main Field', status: 'completed', score1: 2, score2: 2 },
    { id: '3', team1: '12A', team2: '12B', date: '2024-01-17', time: '16:00', venue: 'Main Field', status: 'completed', score1: 4, score2: 0 },
    { id: '4', team1: '9A', team2: '9B', date: '2024-01-18', time: '14:30', venue: 'Main Field', status: 'completed', score1: 1, score2: 3 },
    { id: '5', team1: '10A', team2: '11A', date: '2024-01-20', time: '14:00', venue: 'Main Field', status: 'completed', score1: 2, score2: 1 },
    { id: '6', team1: '12A', team2: '9A', date: '2024-01-22', time: '15:00', venue: 'Main Field', status: 'completed', score1: 3, score2: 2 },
    { id: '7', team1: '10B', team2: '11B', date: '2024-01-24', time: '14:30', venue: 'Main Field', status: 'completed', score1: 0, score2: 2 },
    { id: '8', team1: '12B', team2: '9B', date: '2024-01-25', time: '16:00', venue: 'Main Field', status: 'completed', score1: 1, score2: 1 },
    { id: '9', team1: '10A', team2: '12A', date: '2024-01-28', time: '14:00', venue: 'Main Field', status: 'live', score1: 2, score2: 1 },
    { id: '10', team1: '11A', team2: '9A', date: '2024-01-30', time: '15:30', venue: 'Main Field', status: 'upcoming' },
    { id: '11', team1: '10B', team2: '12B', date: '2024-02-01', time: '14:00', venue: 'Main Field', status: 'upcoming' },
    { id: '12', team1: '11B', team2: '9B', date: '2024-02-03', time: '16:00', venue: 'Main Field', status: 'upcoming' },
    { id: '13', team1: '10A', team2: '9A', date: '2024-02-05', time: '14:30', venue: 'Main Field', status: 'upcoming' },
    { id: '14', team1: '11A', team2: '12A', date: '2024-02-07', time: '15:00', venue: 'Main Field', status: 'upcoming' },
    { id: '15', team1: '10B', team2: '9B', date: '2024-02-10', time: '14:00', venue: 'Main Field', status: 'upcoming' },
];

const Matches = () => {
    const [filterStatus, setFilterStatus] = useState<'upcoming' | 'completed' | 'all'>('all');

    const filteredMatches = useMemo(() => {
        if (filterStatus === 'all') {
            return sampleMatches;
        }
        return sampleMatches.filter(match => match.status === filterStatus);
    }, [filterStatus]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        ← Back to Home
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary">
                            <Image src={matchIcon} alt="Match Icon" width={40} height={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">All Matches</h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Complete schedule and results of all tournament matches
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Filter Buttons */}
                <div className="mb-8 flex gap-2">
                    <Button
                        variant={filterStatus === 'upcoming' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('upcoming')}
                    >
                        Upcoming
                    </Button>
                    <Button
                        variant={filterStatus === 'completed' ? 'default' : 'outline'}
                        onClick={() => setFilterStatus('completed')}
                    >
                        Completed
                    </Button>
                </div>

                {/* Matches Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMatches.map((match) => (
                        <div
                            key={match.id}
                            className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                        >
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
                                        {match.status === 'completed' && (
                                            <p className="text-2xl font-bold mt-1">
                                                {match.score1}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mx-4 flex-shrink-0">
                                        {match.status === 'completed' ? (
                                            <span className="text-xl font-bold text-muted-foreground">
                                                -
                                            </span>
                                        ) : (
                                            <span className="text-2xl font-bold text-muted-foreground">
                                                VS
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center">
                                        <Link
                                            href={`/teams/${match.team2.toLowerCase()}`}
                                            className="text-lg font-semibold hover:text-primary transition-colors"
                                        >
                                            {match.team2}
                                        </Link>
                                        {match.status === 'completed' && (
                                            <p className="text-2xl font-bold mt-1">
                                                {match.score2}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t" />

                                {/* Match Details */}
                                <div className="space-y-2">
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
                                            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 animate-pulse",
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
            </div>
        </div>
    );
};

export default Matches;

