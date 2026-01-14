'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Goal, AlertTriangle, Ban, Shield, Target, X, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import EventTimeline from '@/domains/matches/components/EventTimeline';
import AddEventDialog from './components/AddEventDialog';
import { type Match, type MatchEvent } from '@/domains/matches/contracts';
import { MatchEventType, type CreateMatchEventDto } from '@/generated/types';

type AdminMatchLiveViewUiProps = {
  match: Match;
  events: MatchEvent[];
  currentMinute: number;
  onAddEvent: (dto: CreateMatchEventDto) => Promise<void>;
  onDeleteEvent?: (id: string) => Promise<void>;
  deletingEventId?: string | null;
  onEndMatch: () => Promise<void>;
};

// Predefined quick event types that can be added with a single click
// Each event has a type, display label, icon component, and color styling
const QUICK_EVENTS = [
  { type: MatchEventType.Goal, label: 'Goal', icon: Goal, color: 'bg-green-500 hover:bg-green-600' },
  {
    type: MatchEventType.YellowCard,
    label: 'Yellow Card',
    icon: AlertTriangle,
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
  { type: MatchEventType.RedCard, label: 'Red Card', icon: Ban, color: 'bg-red-500 hover:bg-red-600' },
  { type: MatchEventType.GoalkeeperSave, label: 'Save', icon: Shield, color: 'bg-blue-500 hover:bg-blue-600' },
  {
    type: MatchEventType.PenaltyScored,
    label: 'Penalty Goal',
    icon: Target,
    color: 'bg-green-500 hover:bg-green-600',
  },
  { type: MatchEventType.PenaltyMissed, label: 'Penalty Miss', icon: X, color: 'bg-gray-500 hover:bg-gray-600' },
];

const AdminMatchLiveViewUi = ({
  match,
  events,
  currentMinute,
  onAddEvent,
  onDeleteEvent,
  deletingEventId,
  onEndMatch,
}: AdminMatchLiveViewUiProps) => {
  // State to track if the match is currently being ended (prevents double-clicks)
  const [endingMatch, setEndingMatch] = useState(false);

  // Extract teams array from match data, memoized to avoid unnecessary recalculations
  const teams = useMemo(() => [match.firstOpponent, match.secondOpponent], [match]);

  // Get scores directly from the match data
  const { score1, score2 } = useMemo(() => {
    return { score1: match.score1 ?? 0, score2: match.score2 ?? 0 };
  }, [match]);

  // Handler for ending the match - wraps the onEndMatch callback with loading state
  // Ensures the button shows loading state and prevents multiple simultaneous calls
  const handleEndMatch = async () => {
    setEndingMatch(true);
    try {
      await onEndMatch();
    } finally {
      setEndingMatch(false);
    }
  };

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
              LIVE - {currentMinute}&apos;
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold mb-2">{match.firstOpponent.name}</p>
              <p className="text-5xl font-black text-primary">{score1}</p>
            </div>
            <div className="shrink-0 text-3xl font-bold text-muted-foreground">—</div>
            <div className="flex-1 text-center">
              <p className="text-2xl font-bold mb-2">{match.secondOpponent.name}</p>
              <p className="text-5xl font-black text-primary">{score2}</p>
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
                  matchId={match.id}
                  teams={teams}
                  currentMinute={currentMinute}
                  onAddEvent={onAddEvent}
                  mode="quick"
                  presetType={event.type}
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
              matchId={match.id}
              teams={teams}
              currentMinute={currentMinute}
              onAddEvent={onAddEvent}
              trigger={
                <Button variant="outline" className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Other Event
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
            onDeleteEvent={onDeleteEvent}
            deletingEventId={deletingEventId}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchLiveViewUi;
