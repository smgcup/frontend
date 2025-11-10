"use client";

import React from 'react';
import {
    Trophy,
    Users,
    Target,
    TrendingUp,
    Calendar,
    Award,
    Activity,
    Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Player {
    id: string;
    name: string;
    position: string;
    number: number;
    goals?: number;
    assists?: number;
    matches?: number;
}

interface TeamStats {
    wins: number;
    losses: number;
    draws: number;
    goalsFor: number;
    goalsAgainst: number;
    points: number;
    matchesPlayed: number;
}

interface RecentMatch {
    id: string;
    opponent: string;
    date: string;
    result: string;
    score: string;
    status: 'win' | 'loss' | 'draw';
}

interface TeamPageProps {
    teamId: string;
}

const TeamPage = ({ teamId }: TeamPageProps) => {
    // Sample data - replace with actual API call
    // In a real app, you'd fetch this data based on teamId
    const teamName = teamId.toUpperCase(); // e.g., "10A" -> "10A"

    const players: Player[] = [
        { id: '1', name: 'John Doe', position: 'Forward', number: 9, goals: 12, assists: 5, matches: 8 },
        { id: '2', name: 'Jane Smith', position: 'Midfielder', number: 10, goals: 8, assists: 10, matches: 8 },
        { id: '3', name: 'Mike Johnson', position: 'Defender', number: 4, goals: 2, assists: 3, matches: 8 },
        { id: '4', name: 'Sarah Williams', position: 'Goalkeeper', number: 1, goals: 0, assists: 0, matches: 8 },
        { id: '5', name: 'Tom Brown', position: 'Forward', number: 7, goals: 6, assists: 4, matches: 7 },
        { id: '6', name: 'Emma Davis', position: 'Midfielder', number: 8, goals: 4, assists: 6, matches: 8 },
        { id: '7', name: 'Chris Wilson', position: 'Defender', number: 5, goals: 1, assists: 2, matches: 7 },
        { id: '8', name: 'Lisa Anderson', position: 'Defender', number: 3, goals: 0, assists: 1, matches: 6 },
        { id: '9', name: 'David Lee', position: 'Midfielder', number: 6, goals: 3, assists: 5, matches: 8 },
        { id: '10', name: 'Amy Taylor', position: 'Forward', number: 11, goals: 5, assists: 3, matches: 6 },
    ];

    const stats: TeamStats = {
        wins: 6,
        losses: 1,
        draws: 1,
        goalsFor: 28,
        goalsAgainst: 12,
        points: 19,
        matchesPlayed: 8,
    };

    const recentMatches: RecentMatch[] = [
        { id: '1', opponent: '10B', date: '2024-01-10', result: 'Win', score: '3-1', status: 'win' },
        { id: '2', opponent: '11A', date: '2024-01-05', result: 'Draw', score: '2-2', status: 'draw' },
        { id: '3', opponent: '9A', date: '2023-12-28', result: 'Win', score: '4-0', status: 'win' },
        { id: '4', opponent: '12B', date: '2023-12-20', result: 'Loss', score: '1-2', status: 'loss' },
        { id: '5', opponent: '11B', date: '2023-12-15', result: 'Win', score: '2-1', status: 'win' },
    ];

    const winRate = ((stats.wins / stats.matchesPlayed) * 100).toFixed(1);
    const goalDifference = stats.goalsFor - stats.goalsAgainst;

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
                    <div className="flex items-center gap-6">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                            {teamName}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Team {teamName}</h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Class {teamName} Football Team
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Stats Overview */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Points</p>
                                <p className="text-3xl font-bold">{stats.points}</p>
                            </div>
                            <Trophy className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                                <p className="text-3xl font-bold">{winRate}%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Goals For</p>
                                <p className="text-3xl font-bold">{stats.goalsFor}</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Goal Difference</p>
                                <p className={cn(
                                    "text-3xl font-bold",
                                    goalDifference > 0 ? "text-green-600" : goalDifference < 0 ? "text-red-600" : ""
                                )}>
                                    {goalDifference > 0 ? '+' : ''}{goalDifference}
                                </p>
                            </div>
                            <Activity className="h-8 w-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-bold">Season Statistics</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Matches Played</p>
                            <p className="text-2xl font-bold">{stats.matchesPlayed}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Wins</p>
                            <p className="text-2xl font-bold text-green-600">{stats.wins}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Draws</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.draws}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Losses</p>
                            <p className="text-2xl font-bold text-red-600">{stats.losses}</p>
                        </div>
                    </div>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Goals For</p>
                            <p className="text-2xl font-bold">{stats.goalsFor}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Goals Against</p>
                            <p className="text-2xl font-bold">{stats.goalsAgainst}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Players List */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Players</h2>
                            <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-4">
                            {players.map((player) => (
                                <div
                                    key={player.id}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            #{player.number}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{player.name}</p>
                                            <p className="text-sm text-muted-foreground">{player.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-sm">
                                        {player.goals !== undefined && (
                                            <div className="text-right">
                                                <p className="font-medium">{player.goals}</p>
                                                <p className="text-xs text-muted-foreground">Goals</p>
                                            </div>
                                        )}
                                        {player.assists !== undefined && (
                                            <div className="text-right">
                                                <p className="font-medium">{player.assists}</p>
                                                <p className="text-xs text-muted-foreground">Assists</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Matches */}
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Recent Matches</h2>
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="space-y-4">
                            {recentMatches.map((match) => (
                                <div
                                    key={match.id}
                                    className="rounded-lg border p-4 transition-colors hover:bg-accent"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold">vs {match.opponent}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(match.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-lg font-bold">{match.score}</p>
                                                <p className="text-xs text-muted-foreground">Score</p>
                                            </div>
                                            <span
                                                className={cn(
                                                    "rounded-full px-3 py-1 text-xs font-medium",
                                                    match.status === 'win' &&
                                                    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                                                    match.status === 'loss' &&
                                                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                                                    match.status === 'draw' &&
                                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                )}
                                            >
                                                {match.result}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;

