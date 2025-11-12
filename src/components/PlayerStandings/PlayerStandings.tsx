"use client";

import React, { useState, useMemo } from 'react';
import {
    Trophy,
    Target,
    TrendingUp,
    Award,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Filter,
    X,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import playerIcon from '../../../public/player-icon.svg';

interface Player {
    id: string;
    name: string;
    team: string;
    position: string;
    number: number;
    goals: number;
    assists: number;
    matches: number;
    goalsPerMatch: number;
    totalContributions: number;
}

type SortField = 'goals' | 'assists' | 'totalContributions' | 'goalsPerMatch' | 'matches';
type SortDirection = 'asc' | 'desc';

// Sample data - replace with actual API call
const samplePlayers: Player[] = [
    { id: '1', name: 'John Doe', team: '12A', position: 'Forward', number: 9, goals: 18, assists: 7, matches: 11, goalsPerMatch: 1.64, totalContributions: 25 },
    { id: '2', name: 'Jane Smith', team: '11A', position: 'Midfielder', number: 10, goals: 12, assists: 12, matches: 11, goalsPerMatch: 1.09, totalContributions: 24 },
    { id: '3', name: 'Mike Johnson', team: '10A', position: 'Forward', number: 7, goals: 15, assists: 5, matches: 10, goalsPerMatch: 1.50, totalContributions: 20 },
    { id: '4', name: 'Sarah Williams', team: '12A', position: 'Forward', number: 11, goals: 14, assists: 4, matches: 11, goalsPerMatch: 1.27, totalContributions: 18 },
    { id: '5', name: 'Tom Brown', team: '11A', position: 'Midfielder', number: 8, goals: 8, assists: 9, matches: 11, goalsPerMatch: 0.73, totalContributions: 17 },
    { id: '6', name: 'Emma Davis', team: '10A', position: 'Forward', number: 9, goals: 13, assists: 3, matches: 9, goalsPerMatch: 1.44, totalContributions: 16 },
    { id: '7', name: 'Chris Wilson', team: '12B', position: 'Midfielder', number: 10, goals: 10, assists: 5, matches: 11, goalsPerMatch: 0.91, totalContributions: 15 },
    { id: '8', name: 'Lisa Anderson', team: '11B', position: 'Forward', number: 7, goals: 11, assists: 3, matches: 10, goalsPerMatch: 1.10, totalContributions: 14 },
    { id: '9', name: 'David Lee', team: '10B', position: 'Midfielder', number: 6, goals: 7, assists: 6, matches: 11, goalsPerMatch: 0.64, totalContributions: 13 },
    { id: '10', name: 'Amy Taylor', team: '9A', position: 'Forward', number: 11, goals: 12, assists: 0, matches: 8, goalsPerMatch: 1.50, totalContributions: 12 },
    { id: '11', name: 'Robert Martinez', team: '12A', position: 'Midfielder', number: 8, goals: 5, assists: 7, matches: 11, goalsPerMatch: 0.45, totalContributions: 12 },
    { id: '12', name: 'Sophie Chen', team: '11A', position: 'Forward', number: 9, goals: 9, assists: 2, matches: 9, goalsPerMatch: 1.00, totalContributions: 11 },
    { id: '13', name: 'James Wilson', team: '10A', position: 'Defender', number: 4, goals: 6, assists: 4, matches: 11, goalsPerMatch: 0.55, totalContributions: 10 },
    { id: '14', name: 'Olivia Garcia', team: '12B', position: 'Forward', number: 7, goals: 8, assists: 2, matches: 10, goalsPerMatch: 0.80, totalContributions: 10 },
    { id: '15', name: 'Michael Brown', team: '11B', position: 'Midfielder', number: 6, goals: 4, assists: 5, matches: 11, goalsPerMatch: 0.36, totalContributions: 9 },
];

const PlayerStandings = () => {
    const [sortField, setSortField] = useState<SortField>('goals');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [filterTeam, setFilterTeam] = useState<string>('');
    const [filterPosition, setFilterPosition] = useState<string>('');

    // Get unique teams and positions for filters
    const uniqueTeams = useMemo(() => {
        const teams = [...new Set(samplePlayers.map(p => p.team))].sort();
        return teams;
    }, []);

    const uniquePositions = useMemo(() => {
        const positions = [...new Set(samplePlayers.map(p => p.position))].sort();
        return positions;
    }, []);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Filter and sort players
    const filteredAndSortedPlayers = useMemo(() => {
        const filtered = samplePlayers.filter(player => {
            const matchesTeam = !filterTeam || player.team === filterTeam;
            const matchesPosition = !filterPosition || player.position === filterPosition;
            return matchesTeam && matchesPosition;
        });

        return [...filtered].sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    }, [filterTeam, filterPosition, sortField, sortDirection]);

    const topScorer = filteredAndSortedPlayers[0] || samplePlayers[0];
    const topAssister = [...samplePlayers].sort((a, b) => b.assists - a.assists)[0];
    const mostMatches = [...samplePlayers].sort((a, b) => b.matches - a.matches)[0];

    const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
        <button
            onClick={() => handleSort(field)}
            className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full"
        >
            {children}
            {sortField === field ? (
                sortDirection === 'asc' ? (
                    <ArrowUp className="h-3 w-3" />
                ) : (
                    <ArrowDown className="h-3 w-3" />
                )
            ) : (
                <ArrowUpDown className="h-3 w-3 opacity-30" />
            )}
        </button>
    );

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
                            <Image src={playerIcon} alt="Player Icon" width={40} height={40} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Player Standings</h1>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Top performers and statistics across all teams
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Top Stats Cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Top Scorer</p>
                                <p className="mt-1 text-xl font-bold">{topScorer.name}</p>
                                <p className="text-sm text-muted-foreground">{topScorer.team} • {topScorer.goals} goals</p>
                            </div>
                            <Target className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Top Assister</p>
                                <p className="mt-1 text-xl font-bold">{topAssister.name}</p>
                                <p className="text-sm text-muted-foreground">{topAssister.team} • {topAssister.assists} assists</p>
                            </div>
                            <Award className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Most Active</p>
                                <p className="mt-1 text-xl font-bold">{mostMatches.name}</p>
                                <p className="text-sm text-muted-foreground">{mostMatches.team} • {mostMatches.matches} matches</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Standings Table */}
                <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                            <h2 className="text-2xl font-bold">Player Statistics</h2>
                        </div>
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                <div className="relative">
                                    <select
                                        value={filterTeam}
                                        onChange={(e) => setFilterTeam(e.target.value)}
                                        className="rounded-md border border-input bg-background px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer appearance-none"
                                    >
                                        <option value="">All Teams</option>
                                        {uniqueTeams.map(team => (
                                            <option key={team} value={team}>{team}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                                </div>
                            </div>
                            <div className="relative">
                                <select
                                    value={filterPosition}
                                    onChange={(e) => setFilterPosition(e.target.value)}
                                    className="rounded-md border border-input bg-background px-3 py-1.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer appearance-none"
                                >
                                    <option value="">All Positions</option>
                                    {uniquePositions.map(position => (
                                        <option key={position} value={position}>{position}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                            </div>
                            {(filterTeam || filterPosition) && (
                                <button
                                    onClick={() => {
                                        setFilterTeam('');
                                        setFilterPosition('');
                                    }}
                                    className="flex items-center gap-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm hover:bg-accent transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr className="border-b">
                                    <th className="w-16 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">Rank</th>
                                    <th className="w-48 px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Player</th>
                                    <th className="w-20 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">Team</th>
                                    <th className="w-24 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">Pos</th>
                                    <th className="w-16 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
                                        <SortButton field="matches">M</SortButton>
                                    </th>
                                    <th className="w-16 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
                                        <SortButton field="goals">G</SortButton>
                                    </th>
                                    <th className="w-16 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
                                        <SortButton field="assists">A</SortButton>
                                    </th>
                                    <th className="w-20 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
                                        <SortButton field="totalContributions">Total</SortButton>
                                    </th>
                                    <th className="w-20 px-3 py-3 text-center text-sm font-semibold text-muted-foreground">
                                        <SortButton field="goalsPerMatch">G/M</SortButton>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedPlayers.map((player, index) => (
                                    <tr
                                        key={player.id}
                                        className="border-b transition-colors hover:bg-muted/50"
                                    >
                                        <td className="w-16 px-3 py-4 text-center">
                                            <div
                                                className={cn(
                                                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
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
                                        </td>
                                        <td className="w-48 px-4 py-4 text-left">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                    #{player.number}
                                                </div>
                                                <p className="font-semibold truncate">{player.name}</p>
                                            </div>
                                        </td>
                                        <td className="w-20 px-3 py-4 text-center">
                                            <Link
                                                href={`/teams/${player.team.toLowerCase()}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {player.team}
                                            </Link>
                                        </td>
                                        <td className="w-24 px-3 py-4 text-center">
                                            <p className="text-sm text-muted-foreground">{player.position}</p>
                                        </td>
                                        <td className="w-16 px-3 py-4 text-center">
                                            <p className="font-medium">{player.matches}</p>
                                        </td>
                                        <td className="w-16 px-3 py-4 text-center">
                                            <p className="font-bold text-yellow-600 dark:text-yellow-500">{player.goals}</p>
                                        </td>
                                        <td className="w-16 px-3 py-4 text-center">
                                            <p className="font-bold text-blue-600 dark:text-blue-500">{player.assists}</p>
                                        </td>
                                        <td className="w-20 px-3 py-4 text-center">
                                            <p className="font-bold">{player.totalContributions}</p>
                                        </td>
                                        <td className="w-20 px-3 py-4 text-center">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {player.goalsPerMatch.toFixed(2)}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerStandings;

