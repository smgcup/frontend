"use client";

import React from 'react';
import {
    Trophy,
    Users,
    Target,
    TrendingUp,
    Activity,
    Award,
    Calendar,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import goalIcon from '../../../public/goal-icon.svg';
import playerIcon from '../../../public/player-icon.svg';
import Image from 'next/image';
import matchIcon from '../../../public/match-icon.svg';
import teamIcon from '../../../public/team-icon.svg';

interface StatCard {
    id: string;
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

interface TopTeam {
    id: string;
    name: string;
    points: number;
    wins: number;
}

const TournamentStatistics = () => {
    // Sample data - replace with actual data from your API
    const overallStats: StatCard[] = [
        {
            id: '1',
            label: 'Total Matches',
            value: 48,
            icon: <Image src={matchIcon} alt="Match Icon" width={40} height={40} />,
            color: 'text-blue-500',
        },
        {
            id: '2',
            label: 'Total Teams',
            value: 12,
            icon: <Image src={teamIcon} alt="Team Icon" width={32} height={32} />,
            color: 'text-green-500',
        },
        {
            id: '3',
            label: 'Total Goals',
            value: 156,
            icon: <Image src={goalIcon} alt="Goal Icon" width={32} height={32} />,
            color: 'text-purple-500',
        },
        {
            id: '4',
            label: 'Avg Goals/Match',
            value: '3.25',
            icon: <Image src={playerIcon} alt="Player Icon" width={32} height={32} />,
            color: 'text-orange-500',
        },
    ];

    const topTeams: TopTeam[] = [
        { id: '1', name: '12A', points: 28, wins: 9 },
        { id: '2', name: '11A', points: 25, wins: 8 },
        { id: '3', name: '10A', points: 22, wins: 7 },
        { id: '4', name: '12B', points: 19, wins: 6 },
    ];

    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Tournament Statistics
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Overview of the league performance and key metrics
                    </p>
                </div>

                {/* Overall Stats Grid */}
                <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {overallStats.map((stat) => (
                        <div
                            key={stat.id}
                            className="group relative overflow-hidden rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.label}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={cn("opacity-80", stat.color)}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Top Teams */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-2">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <h3 className="text-2xl font-bold">Top Teams</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {topTeams.map((team, index) => (
                            <div
                                key={team.id}
                                className="group relative overflow-hidden rounded-lg border bg-background p-4 transition-all hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                                                index === 0 &&
                                                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                                                index === 1 &&
                                                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
                                                index === 2 &&
                                                "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
                                                index >= 3 &&
                                                "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold">Team {team.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {team.wins} wins
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">{team.points}</p>
                                        <p className="text-xs text-muted-foreground">pts</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TournamentStatistics;

