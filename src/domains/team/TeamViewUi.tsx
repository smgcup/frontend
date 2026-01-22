'use client';

import { useState } from 'react';
import { Users, Calendar, BarChart3, Shield } from 'lucide-react';
import Image from 'next/image';
import { BackButton } from '@/components/BackButton';
import { cn } from '@/lib/utils';
import { PlayerPosition } from '@/generated/types';
import type { Team } from './contracts';
import type { Player } from '@/domains/player/contracts';
import type { Match } from '@/domains/matches/contracts';
import { MatchStatus } from '@/graphql';

type Tab = 'squad' | 'matches' | 'stats';

const POSITION_ORDER: PlayerPosition[] = [
  PlayerPosition.Goalkeeper,
  PlayerPosition.Defender,
  PlayerPosition.Midfielder,
  PlayerPosition.Forward,
];

const POSITION_LABELS: Record<PlayerPosition, string> = {
  [PlayerPosition.Goalkeeper]: 'Goalkeepers',
  [PlayerPosition.Defender]: 'Defenders',
  [PlayerPosition.Midfielder]: 'Midfielders',
  [PlayerPosition.Forward]: 'Forwards',
};

// Mock data for matches
const mockMatches: Match[] = [];

// Mock data for stats
const mockStats = {
  matchesPlayed: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsScored: 0,
  goalsConceded: 0,
  cleanSheets: 0,
  yellowCards: 0,
  redCards: 0,
  averagePossession: 0,
  shotsPerGame: 0,
  passAccuracy: 0,
};

export function TeamViewUi({ team }: { team: Team }) {
  const [activeTab, setActiveTab] = useState<Tab>('squad');

  const tabs = [
    { id: 'squad' as const, label: 'Squad', icon: Users },
    { id: 'matches' as const, label: 'Matches', icon: Calendar },
    { id: 'stats' as const, label: 'Statistics', icon: BarChart3 },
  ];

  const groupedPlayers = POSITION_ORDER.reduce(
    (acc, position) => {
      const playersInPosition = (team.players || []).filter((p: Player) => p.position === position);
      if (playersInPosition.length > 0) {
        acc[position] = playersInPosition;
      }
      return acc;
    },
    {} as Record<PlayerPosition, Player[]>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <BackButton />

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{team.name}</h1>
              <p className="text-muted-foreground mt-1">
                {(team.players || []).length} players
                {team.captain && (
                  <>
                    <br />
                    Captain: {team.captain.firstName} {team.captain.lastName}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b sticky top-[66px] bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'squad' && (
          <div className="space-y-8">
            {POSITION_ORDER.map((position) => {
              const players = groupedPlayers[position];
              if (!players || players.length === 0) return null;

              return (
                <div key={position}>
                  <h2 className="text-xl font-semibold mb-4 text-primary">
                    {POSITION_LABELS[position]}
                  </h2>
                  <div className="space-y-3">
                    {players.map((player) => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        isCaptain={team.captain?.id === player.id}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {(team.players || []).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No players in this team yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Recent Matches</h2>
            {mockMatches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>There are no matches yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockMatches.map((match) => {
                  const isHome = match.firstOpponent.id === team.id;
                  const opponent = isHome ? match.secondOpponent : match.firstOpponent;
                  const teamScore = isHome ? match.score1 : match.score2;
                  const opponentScore = isHome ? match.score2 : match.score1;
                  
                  // Calculate result (only for finished matches)
                  let result: 'W' | 'D' | 'L' | null = null;
                  if (match.status === MatchStatus.Finished && teamScore !== undefined && opponentScore !== undefined) {
                    if (teamScore > opponentScore) {
                      result = 'W';
                    } else if (teamScore < opponentScore) {
                      result = 'L';
                    } else {
                      result = 'D';
                    }
                  }
                  
                  const scoreDisplay = 
                    match.status === MatchStatus.Finished && teamScore !== undefined && opponentScore !== undefined
                      ? `${teamScore}-${opponentScore}`
                      : match.status === MatchStatus.Live && teamScore !== undefined && opponentScore !== undefined
                      ? `${teamScore}-${opponentScore}`
                      : '—';
                  
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {result && (
                          <span
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                              result === 'W' && 'bg-green-500/10 text-green-600',
                              result === 'D' && 'bg-yellow-500/10 text-yellow-600',
                              result === 'L' && 'bg-red-500/10 text-red-600'
                            )}
                          >
                            {result}
                          </span>
                        )}
                        <div>
                          <p className="font-medium">
                            {isHome ? 'vs' : '@'} {opponent.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(match.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{scoreDisplay}</p>
                        <p className="text-xs text-muted-foreground">
                          {isHome ? 'Home' : 'Away'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold mb-4">Team Statistics</h2>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Matches Played" value={mockStats.matchesPlayed} />
              <StatCard label="Wins" value={mockStats.wins} highlight="green" />
              <StatCard label="Draws" value={mockStats.draws} highlight="yellow" />
              <StatCard label="Losses" value={mockStats.losses} highlight="red" />
            </div>

            {/* Goals */}
            <div>
              <h3 className="text-lg font-medium mb-3">Goals</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard label="Goals Scored" value={mockStats.goalsScored} />
                <StatCard label="Goals Conceded" value={mockStats.goalsConceded} />
                <StatCard label="Clean Sheets" value={mockStats.cleanSheets} />
              </div>
            </div>

            {/* Discipline */}
            <div>
              <h3 className="text-lg font-medium mb-3">Discipline</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Yellow Cards" value={mockStats.yellowCards} highlight="yellow" />
                <StatCard label="Red Cards" value={mockStats.redCards} highlight="red" />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function PlayerCard({ player, isCaptain }: { player: Player; isCaptain: boolean }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors">
      <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 relative">
        {player.imageUrl ? (
          <Image
            src={player.imageUrl ?? '/placeholder.svg'}
            alt={`${player.firstName} ${player.lastName}`}
            fill
            sizes="56px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <Users className="h-6 w-6 text-primary/50" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-foreground">
            {player.firstName} {player.lastName}
          </p>
          {isCaptain && (
            <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              Captain
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: 'green' | 'yellow' | 'red';
}) {
  return (
    <div className="p-4 rounded-xl border bg-card/50">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p
        className={cn(
          'text-2xl font-bold',
          highlight === 'green' && 'text-green-600',
          highlight === 'yellow' && 'text-yellow-600',
          highlight === 'red' && 'text-red-600',
          !highlight && 'text-foreground'
        )}
      >
        {value}
      </p>
    </div>
  );
}
