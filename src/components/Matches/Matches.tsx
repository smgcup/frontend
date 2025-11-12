"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { matchIcon } from '../../../public/icons';
import MobilePageHeader from '../MobilePageHeader';
import MatchCard, { Match } from '@/features/matches/components/MatchCard';

// Sample data - replace with actual API call
const sampleMatches: Match[] = [
    { id: '1', team1: '10A', team2: '10B', date: '2024-01-15', time: '14:00', venue: 'Main Field', status: 'completed', score1: 3, score2: 1, round: 1 },
    { id: '2', team1: '11A', team2: '11B', date: '2024-01-16', time: '15:30', venue: 'Main Field', status: 'completed', score1: 2, score2: 2, round: 1 },
    { id: '3', team1: '12A', team2: '12B', date: '2024-01-17', time: '16:00', venue: 'Main Field', status: 'completed', score1: 4, score2: 0, round: 1 },
    { id: '4', team1: '9A', team2: '9B', date: '2024-01-18', time: '14:30', venue: 'Main Field', status: 'completed', score1: 1, score2: 3, round: 1 },
    { id: '5', team1: '10A', team2: '11A', date: '2024-01-20', time: '14:00', venue: 'Main Field', status: 'completed', score1: 2, score2: 1, round: 2 },
    { id: '6', team1: '12A', team2: '9A', date: '2024-01-22', time: '15:00', venue: 'Main Field', status: 'completed', score1: 3, score2: 2, round: 2 },
    { id: '7', team1: '10B', team2: '11B', date: '2024-01-24', time: '14:30', venue: 'Main Field', status: 'completed', score1: 0, score2: 2, round: 2 },
    { id: '8', team1: '12B', team2: '9B', date: '2024-01-25', time: '16:00', venue: 'Main Field', status: 'completed', score1: 1, score2: 1, round: 2 },
    { id: '9', team1: '10A', team2: '12A', date: '2024-01-28', time: '14:00', venue: 'Main Field', status: 'live', score1: 2, score2: 1, round: 3 },
    { id: '10', team1: '11A', team2: '9A', date: '2024-01-30', time: '15:30', venue: 'Main Field', status: 'upcoming', round: 3 },
    { id: '11', team1: '10B', team2: '12B', date: '2024-02-01', time: '14:00', venue: 'Main Field', status: 'upcoming', round: 3 },
    { id: '12', team1: '11B', team2: '9B', date: '2024-02-03', time: '16:00', venue: 'Main Field', status: 'upcoming', round: 3 },
    { id: '13', team1: '10A', team2: '9A', date: '2024-02-05', time: '14:30', venue: 'Main Field', status: 'upcoming', round: 4 },
    { id: '14', team1: '11A', team2: '12A', date: '2024-02-07', time: '15:00', venue: 'Main Field', status: 'upcoming', round: 4 },
    { id: '15', team1: '10B', team2: '9B', date: '2024-02-10', time: '14:00', venue: 'Main Field', status: 'upcoming', round: 5 },
];

const Matches = () => {
    // Determine current round based on match statuses and dates
    const getCurrentRound = (): number => {
        // Check if there are any live matches - that round is current
        const liveMatch = sampleMatches.find(match => match.status === 'live');
        if (liveMatch) {
            return liveMatch.round;
        }

        // Find the earliest upcoming match - that round is current
        const upcomingMatches = sampleMatches.filter(match => match.status === 'upcoming');
        if (upcomingMatches.length > 0) {
            const sortedUpcoming = [...upcomingMatches].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );
            return sortedUpcoming[0].round;
        }

        // If all matches are completed, return the highest round
        const allRounds = sampleMatches.map(match => match.round);
        return Math.max(...allRounds);
    };

    const currentRound = useMemo(() => getCurrentRound(), []);
    const [selectedRound, setSelectedRound] = useState<number>(() => getCurrentRound());

    const filteredMatches = useMemo(() => {
        return sampleMatches.filter(match => match.round === selectedRound);
    }, [selectedRound]);

    const rounds = [1, 2, 3, 4, 5];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <MobilePageHeader title="All Matches" description="Complete schedule and results of all tournament matches" icon={matchIcon} />

            <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Filter Buttons */}
                <div className="mb-8 flex flex-wrap gap-2">
                    {rounds.map((round) => {
                        const isFutureRound = round > currentRound;
                        const isCurrentRound = round === currentRound;

                        return (
                            <Button
                                key={round}
                                variant={selectedRound === round ? 'default' : 'outline'}
                                onClick={() => !isFutureRound && setSelectedRound(round)}
                                disabled={isFutureRound}
                                className={isCurrentRound && selectedRound !== round ? 'ring-2 ring-primary' : ''}
                            >
                                Round {round}
                                {isCurrentRound && ' (Current)'}
                            </Button>
                        );
                    })}
                </div>

                {/* Matches Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMatches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Matches;

