'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Goal, AlertTriangle, Ban, Shield, Target, X, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import EventTimeline, { MatchEventType } from './components/EventTimeline';
import AddEventDialog from './components/AddEventDialog';

type Player = {
  id: string;
  firstName: string;
  lastName: string;
};

type Team = {
  id: string;
  name: string;
  players: Player[];
};

type MatchEvent = {
  id: string;
  type: MatchEventType;
  minute: number;
  player?: Player;
  team: Team;
};

type Match = {
  id: string;
  firstOpponent: Team;
  secondOpponent: Team;
  date: string;
  status: 'LIVE';
  score1: number;
  score2: number;
};

type AdminMatchLiveViewUiProps = {
  match: Match | null;
  events: MatchEvent[];
  matchLoading: boolean;
  currentMinute: number;
  onAddEvent: (data: { type: MatchEventType; minute: number; playerId?: string; teamId: string }) => Promise<void>;
  onEndMatch: () => Promise<void>;
};

const QUICK_EVENTS = [
  { type: MatchEventType.GOAL, label: 'Goal', icon: Goal, color: 'bg-green-500 hover:bg-green-600' },
  {
    type: MatchEventType.YELLOW_CARD,
    label: 'Yellow Card',
    icon: AlertTriangle,
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
  { type: MatchEventType.RED_CARD, label: 'Red Card', icon: Ban, color: 'bg-red-500 hover:bg-red-600' },
  { type: MatchEventType.GOALKEEPER_SAVE, label: 'Save', icon: Shield, color: 'bg-blue-500 hover:bg-blue-600' },
  {
    type: MatchEventType.PENALTY_SCORED,
    label: 'Penalty Goal',
    icon: Target,
    color: 'bg-green-500 hover:bg-green-600',
  },
  { type: MatchEventType.PENALTY_MISSED, label: 'Penalty Miss', icon: X, color: 'bg-gray-500 hover:bg-gray-600' },
];

const AdminMatchLiveViewUi = ({
  match,
  events,
  matchLoading,
  currentMinute,
  onAddEvent,
  onEndMatch,
}: AdminMatchLiveViewUiProps) => {
  const [endingMatch, setEndingMatch] = useState(false);

  const handleEndMatch = async () => {
    setEndingMatch(true);
    try {
      await onEndMatch();
    } finally {
      setEndingMatch(false);
    }
  };

  if (matchLoading) {
    return (
      <div className="py-4 lg:p-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading match...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="py-4 lg:p-10">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p>Match not found or is not live. Please check the match status.</p>
        </div>
      </div>
    );
  }

  const teams = [match.firstOpponent, match.secondOpponent];

  return (
    <div className="space-y-6 py-4 lg:p-10">
      <AdminPageHeader
        title="Live Match Management"
        description={`${match.firstOpponent.name} vs ${match.secondOpponent.name}`}
        backHref="/admin/matches"
      />

      {/* Match Score Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-around">
            <CardTitle className="text-2xl">Match Score</CardTitle>
            <Badge
              variant="outline"
              className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 animate-pulse"
            >
              <Clock className="h-3 w-3 mr-1" />
              LIVE - {currentMinute}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold mb-2">{match.firstOpponent.name}</p>
              <p className="text-5xl font-black text-primary">{match.score1}</p>
            </div>
            <div className="shrink-0 text-3xl font-bold text-muted-foreground">—</div>
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold mb-2">{match.secondOpponent.name}</p>
              <p className="text-5xl font-black text-primary">{match.score2}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_EVENTS.map((event) => {
              const Icon = event.icon;
              return (
                <AddEventDialog
                  key={event.type}
                  teams={teams}
                  currentMinute={currentMinute}
                  onAddEvent={onAddEvent}
                  trigger={
                    <Button variant="outline" className={cn('h-auto flex-col gap-2 py-4', event.color)}>
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{event.label}</span>
                    </Button>
                  }
                />
              );
            })}
          </div>
          <div className="mt-4 flex gap-3">
            <AddEventDialog
              teams={teams}
              currentMinute={currentMinute}
              onAddEvent={onAddEvent}
              trigger={
                <Button variant="outline" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Event
                </Button>
              }
            />
            <Button variant="destructive" onClick={handleEndMatch} disabled={endingMatch} className="flex-1">
              {endingMatch ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ending...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  End Match
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Match Events Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <EventTimeline
            events={events}
            firstOpponentName={match.firstOpponent.name}
            secondOpponentName={match.secondOpponent.name}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchLiveViewUi;
