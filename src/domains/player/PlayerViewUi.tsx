'use client';

import { useState, useEffect } from 'react';
import { User, Calendar, BarChart3, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BackButton } from '@/components/BackButton';
import { cn } from '@/lib/utils';
import { PlayerPosition, PreferredFoot } from '@/generated/types';
import type { Player } from './contracts';
import type { Match } from '@/domains/matches/contracts';
import MatchCard from '@/domains/matches/components/MatchCard';

type Tab = 'overview' | 'matches' | 'stats';

const PREFERRED_FOOT_LABELS: Record<PreferredFoot, string> = {
  [PreferredFoot.Left]: 'Left',
  [PreferredFoot.Right]: 'Right',
  [PreferredFoot.Both]: 'Both',
};

export function PlayerViewUi({ player }: { player: Player }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const openDrawer = () => {
    setIsDrawerOpen(true);
    // Trigger animation after mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsDrawerVisible(true);
      });
    });
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
    setTimeout(() => {
      setIsDrawerOpen(false);
    }, 300);
  };

  // Lock body scroll when drawer or image modal is open
  useEffect(() => {
    if (isDrawerOpen || isImageOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, isImageOpen]);

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

  const isGoalkeeper = player.position === PlayerPosition.Goalkeeper;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-linear-to-b from-primary/10 to-background border-b">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <BackButton />

          <div className="flex items-center gap-4">
            <button
              onClick={() => player.imageUrl && setIsImageOpen(true)}
              className={cn(
                'h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden relative',
                player.imageUrl && 'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-shadow',
              )}
            >
              {player.imageUrl ? (
                <Image
                  src={player.imageUrl ?? '/placeholder.svg'}
                  alt={`${player.firstName} ${player.lastName}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                  priority
                />
              ) : (
                <User className="h-10 w-10 text-primary" />
              )}
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {player.firstName} {player.lastName}
              </h1>
              <p className="text-muted-foreground mt-1">
                {player.team && (
                  <>
                    <Link
                      href={`/teams/${player.team.id}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {player.team.name}
                    </Link>
                    {' • '}
                  </>
                )}
                {player.position}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b sticky top-[66px] bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 max-w-3xl">
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
            <div className="grid grid-cols-2 gap-4">
              <InfoCard
                label="Preferred Foot"
                value={player.preferredFoot ? PREFERRED_FOOT_LABELS[player.preferredFoot] : 'N/A'}
              />
              <InfoCard label="Date of Birth" value={formatDate(player.dateOfBirth)} />
            </div>

            {/* Compact Grid Layout - Row 2 */}
            <div className="grid grid-cols-3 gap-4">
              <InfoCard label="Appearances" value={player.stats?.appearances ?? 0} />
              {isGoalkeeper ? (
                <>
                  <InfoCard label="Saves" value={player.stats?.goalkeeperSaves ?? 0} />
                  <InfoCard label="Goals" value={player.stats?.goals ?? 0} />
                </>
              ) : (
                <>
                  <InfoCard label="Goals" value={player.stats?.goals ?? 0} />
                  <InfoCard label="Assists" value={player.stats?.assists ?? 0} />
                </>
              )}
            </div>

            {/* Full Bio Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={openDrawer}
                className="px-8 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors w-full"
              >
                Full Bio
              </button>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-4 max-w-7xl mx-auto">
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
          <div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
            <h2 className="text-lg md:text-xl font-semibold mb-4">Player Statistics</h2>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <StatCard label="Appearances" value={player.stats?.appearances ?? 0} />
              <StatCard label="Goals" value={player.stats?.goals ?? 0} highlight="green" />
              <StatCard label="Assists" value={player.stats?.assists ?? 0} highlight="blue" />
            </div>

            {/* Penalties */}
            <div>
              <h3 className="text-base md:text-lg font-medium mb-3">Penalties</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <StatCard label="Penalties Scored" value={player.stats?.penaltiesScored ?? 0} highlight="green" />
                <StatCard label="Penalties Missed" value={player.stats?.penaltiesMissed ?? 0} highlight="red" />
              </div>
            </div>

            {/* Goalkeeper Stats - only for goalkeepers */}
            {isGoalkeeper && (
              <div>
                <h3 className="text-base md:text-lg font-medium mb-3">Goalkeeper</h3>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <StatCard label="Saves" value={player.stats?.goalkeeperSaves ?? 0} highlight="blue" />
                </div>
              </div>
            )}

            {/* Other */}
            <div>
              <h3 className="text-base md:text-lg font-medium mb-3">Other</h3>
              <div className="grid grid-cols-1 gap-3 md:gap-4">
                <StatCard label="Own Goals" value={player.stats?.ownGoals ?? 0} />
              </div>
            </div>

            {/* Discipline */}
            <div>
              <h3 className="text-base md:text-lg font-medium mb-3">Discipline</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <StatCard label="Yellow Cards" value={player.stats?.yellowCards ?? 0} highlight="yellow" />
                <StatCard label="Red Cards" value={player.stats?.redCards ?? 0} highlight="red" />
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
            className={cn(
              'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
              isDrawerVisible ? 'opacity-100' : 'opacity-0',
            )}
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div
            className={cn(
              'fixed z-50 bg-background shadow-lg overflow-y-auto transition-transform duration-300',
              // Mobile: bottom sheet
              'inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl',
              // Desktop: right sidebar
              'md:inset-y-0 md:right-0 md:left-auto md:w-full md:max-w-md md:h-full md:max-h-none md:rounded-t-none md:rounded-l-2xl',
              // Animation
              isDrawerVisible
                ? 'translate-y-0 md:translate-y-0 md:translate-x-0'
                : 'translate-y-full md:translate-y-0 md:translate-x-full',
            )}
          >
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between rounded-t-2xl md:rounded-t-none">
              <h2 className="text-xl font-bold">Full Bio</h2>
              <button onClick={closeDrawer} className="p-2 rounded-lg hover:bg-muted transition-colors">
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
                  <BioField label="Position" value={player.position ?? '-'} />
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
            </div>
          </div>
        </>
      )}

      {/* Image Modal */}
      {isImageOpen && player.imageUrl && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/80 z-50 animate-in fade-in duration-200"
            onClick={() => setIsImageOpen(false)}
          />

          {/* Image Container */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setIsImageOpen(false)}
          >
            <div className="relative w-full max-w-md aspect-square animate-in zoom-in-75 duration-300">
              <Image
                src={player.imageUrl}
                alt={`${player.firstName} ${player.lastName}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover rounded-2xl"
                unoptimized
              />
              <button
                onClick={() => setIsImageOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-4 md:p-6 rounded-xl border bg-card/50 overflow-hidden">
      <p className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2">{label}</p>
      <p className="text-base md:text-xl font-bold text-foreground truncate">{value}</p>
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
    <div className="p-3 md:p-4 rounded-xl border bg-card/50">
      <p className="text-xs md:text-sm text-muted-foreground mb-1">{label}</p>
      <p
        className={cn(
          'text-xl md:text-2xl font-bold',
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
