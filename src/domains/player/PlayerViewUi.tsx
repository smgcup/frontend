'use client';

import { useState } from 'react';
import { User, Calendar, BarChart3, X } from 'lucide-react';
import Image from 'next/image';
import { BackButton } from '@/components/BackButton';
import { cn } from '@/lib/utils';
import { PreferredFoot } from '@/generated/types';
import type { Player } from './contracts';
import type { Match } from '@/domains/matches/contracts';
import MatchCard from '@/domains/matches/components/MatchCard';

type Tab = 'overview' | 'matches' | 'stats';

// Mock data for player stats
const mockStats = {
  appearances: 0,
  goals: 0,
  assists: 0,
  cleanSheets: 0,
  savesMade: 0,
  yellowCards: 0,
  redCards: 0,
  minutesPlayed: 0,
  shotsOnTarget: 0,
  passAccuracy: 0,
};

const PREFERRED_FOOT_LABELS: Record<PreferredFoot, string> = {
  [PreferredFoot.Left]: 'Left',
  [PreferredFoot.Right]: 'Right',
  [PreferredFoot.Both]: 'Both',
};

export function PlayerViewUi({ player }: { player: Player }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: User },
    { id: 'matches' as const, label: 'Matches', icon: Calendar },
    { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8">
          <BackButton />

          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden relative">
              {player.imageUrl ? (
                <Image
                  src={player.imageUrl ?? '/placeholder.svg'}
                  alt={`${player.firstName} ${player.lastName}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {player.firstName} {player.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {player.team && <> {player.team.name} • </>}
                {player.position}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b sticky top-[66px] bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 justify-center md:justify-start">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30',
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
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Compact Grid Layout - Row 1 */}
            <div className="grid grid-cols-3 gap-4">
              <InfoCard label="Nationality" value="Spain" flag="🇪🇸" />
              <InfoCard
                label="Preferred Foot"
                value={player.preferredFoot ? PREFERRED_FOOT_LABELS[player.preferredFoot] : 'N/A'}
              />
              <InfoCard label="Date of Birth" value={formatDate(player.dateOfBirth)} />
            </div>

            {/* Compact Grid Layout - Row 2 */}
            <div className="grid grid-cols-3 gap-4">
              <InfoCard label="Appearances" value={mockStats.appearances} />
              <InfoCard label="Clean Sheets" value={mockStats.cleanSheets} />
              <InfoCard label="Saves Made" value={mockStats.savesMade} />
            </div>

            {/* Full Bio Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="px-8 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors w-full"
              >
                Full Bio
              </button>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              {player.team ? `${player.team.name} Matches` : 'Recent Matches'}
            </h2>
            {!player.matches || player.matches.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>There are no matches yet</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {player.matches.map((match) => {
                  // Transform match so the player's team is always on the left (firstOpponent)
                  const isTeamFirst = match.firstOpponent.id === player.team?.id;
                  const normalizedMatch: Match = isTeamFirst
                    ? match
                    : {
                        ...match,
                        firstOpponent: match.secondOpponent,
                        secondOpponent: match.firstOpponent,
                        score1: match.score2,
                        score2: match.score1,
                      };

                  return <MatchCard key={match.id} match={normalizedMatch} />;
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold mb-4">Player Statistics</h2>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Appearances" value={mockStats.appearances} />
              <StatCard label="Goals" value={mockStats.goals} highlight="green" />
              <StatCard label="Assists" value={mockStats.assists} highlight="blue" />
              <StatCard label="Minutes Played" value={mockStats.minutesPlayed} />
            </div>

            {/* Performance */}
            <div>
              <h3 className="text-lg font-medium mb-3">Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard label="Clean Sheets" value={mockStats.cleanSheets} />
                <StatCard label="Saves Made" value={mockStats.savesMade} />
                <StatCard label="Shots on Target" value={mockStats.shotsOnTarget} />
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

      {/* Drawer for Full Bio */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-lg animate-in slide-in-from-bottom duration-300 max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-xl font-bold">Full Bio</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <BioField label="First Name" value={player.firstName} />
                  <BioField label="Last Name" value={player.lastName} />
                  <BioField label="Date of Birth" value={formatDate(player.dateOfBirth)} />
                  <BioField label="Age" value={player.age ? `${player.age} years` : 'N/A'} />
                  <BioField label="Nationality" value="Spain" />
                  <BioField label="Position" value={player.position} />
                </div>
              </div>

              {/* Physical Attributes */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-primary">Physical Attributes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <BioField label="Height" value={player.height ? `${player.height} cm` : 'N/A'} />
                  <BioField label="Weight" value={player.weight ? `${player.weight} kg` : 'N/A'} />
                  <BioField
                    label="Preferred Foot"
                    value={player.preferredFoot ? PREFERRED_FOOT_LABELS[player.preferredFoot] : 'N/A'}
                  />
                </div>
              </div>

              {/* Team Information */}
              {player.team && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary">Team Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <BioField label="Current Team" value={player.team.name} />
                    {player.class && <BioField label="Class" value={player.class} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function InfoCard({ label, value, flag }: { label: string; value: string | number; flag?: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card/50">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="flex items-center gap-2">
        {flag && <span className="text-2xl">{flag}</span>}
        <p className="text-xl font-bold text-foreground">{value}</p>
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
  highlight?: 'green' | 'blue' | 'yellow' | 'red';
}) {
  return (
    <div className="p-4 rounded-xl border bg-card/50">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p
        className={cn(
          'text-2xl font-bold',
          highlight === 'green' && 'text-green-600',
          highlight === 'blue' && 'text-blue-600',
          highlight === 'yellow' && 'text-yellow-600',
          highlight === 'red' && 'text-red-600',
          !highlight && 'text-foreground',
        )}
      >
        {value}
      </p>
    </div>
  );
}

function BioField({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium text-foreground">{value}</p>
    </div>
  );
}

export default PlayerViewUi;
