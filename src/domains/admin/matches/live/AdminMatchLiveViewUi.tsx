'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Goal, AlertTriangle, Ban, Shield, ShieldCheck, Target, X, Clock, Loader2, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminPageHeader from '@/domains/admin/components/AdminPageHeader';
import EventTimeline from '@/domains/matches/components/EventTimeline';
import AddEventDialog from './components/AddEventDialog';
import { type Match, type MatchEvent } from '@/domains/matches/contracts';
import { MatchEventType, type CreateMatchEventDto } from '@/generated/types';
import { MatchStatus } from '@/graphql';

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
// Split into two rows for better layout
const QUICK_EVENTS_ROW1 = [
  { type: MatchEventType.Goal, label: 'Goal', icon: Goal, color: 'bg-green-500 hover:bg-green-600' },
  { type: MatchEventType.GoalkeeperSave, label: 'Save', icon: Shield, color: 'bg-blue-500 hover:bg-blue-600' },
  {
    type: MatchEventType.YellowCard,
    label: 'Yellow Card',
    icon: AlertTriangle,
    color: 'bg-yellow-500 hover:bg-yellow-600',
  },
  { type: MatchEventType.RedCard, label: 'Red Card', icon: Ban, color: 'bg-red-500 hover:bg-red-600' },
];

const QUICK_EVENTS_ROW2 = [
  {
    type: MatchEventType.PenaltyScored,
    label: 'Penalty Goal',
    icon: Target,
    color: 'bg-green-500 hover:bg-green-600',
  },
  { type: MatchEventType.PenaltyMissed, label: 'Penalty Miss', icon: X, color: 'bg-gray-500 hover:bg-gray-600' },
  {
    type: MatchEventType.PenaltySave,
    label: 'Penalty Save',
    icon: ShieldCheck,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  { type: MatchEventType.OwnGoal, label: 'Own Goal', icon: Undo2, color: 'bg-orange-500 hover:bg-orange-600' },
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
  // Extract teams array from match data, memoized to avoid unnecessary recalculations
  const teams = useMemo(() => [match.firstOpponent, match.secondOpponent], [match]);

  // Get status configuration for display
  const statusConfig = useMemo(() => {
    const statusMap: Record<MatchStatus, { label: string; className: string }> = {
      [MatchStatus.Scheduled]: {
        label: 'Scheduled',
        className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      },
      [MatchStatus.Live]: {
        label: 'Live',
        className: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      },
      [MatchStatus.Finished]: {
        label: 'Finished',
        className: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      },
      [MatchStatus.Cancelled]: {
        label: 'Cancelled',
        className: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20',
      },
    };
    return statusMap[match.status];
  }, [match.status]);

  // Get scores directly from the match data
  const { score1, score2 } = useMemo(() => {
    return { score1: match.score1 ?? 0, score2: match.score2 ?? 0 };
  }, [match]);

  // Count how many half time events have already been triggered
  const halfTimeCount = useMemo(() => {
    return events.filter((event) => event.type === MatchEventType.HalfTime).length;
  }, [events]);

  // Count how many full time events have already been added
  const fullTimeCount = useMemo(() => {
    return events.filter((event) => event.type === MatchEventType.FullTime).length;
  }, [events]);

  // Calculate the minute for half time event
  // Defaults: 25', 50', 58', 64' for subsequent half times
  // If there's an event past the default minute, use the minute of the last event
  const halfTimeMinute = useMemo(() => {
    // Determine the default minute based on how many half times have been triggered
    // 0: 25' (first half), 1: 50' (second half), 2: 58' (first extra time), 3: 64' (second extra time)
    const defaultMinute = halfTimeCount === 0 ? 25 : halfTimeCount === 1 ? 50 : halfTimeCount === 2 ? 58 : 64;

    // Find the last event minute (excluding half time events to get the actual last match event)
    const matchEvents = events.filter((event) => event.type !== MatchEventType.HalfTime);
    const lastEventMinute = matchEvents.length > 0 ? Math.max(...matchEvents.map((event) => event.minute)) : 0;

    // If there's an event past the default minute, use that minute, otherwise use the default
    return lastEventMinute > defaultMinute ? lastEventMinute : defaultMinute;
  }, [events, halfTimeCount]);

  // Disable half time button after 64' half time has been added (halfTimeCount >= 4)
  // halfTimeCount: 0=25', 1=50', 2=58', 3=64', 4+=disabled
  const isHalfTimeDisabled = halfTimeCount >= 4;

  // Disable full time button if there are no half times, if there are 2 or 3 half time events, or if a full time event already exists
  // Full time can only be added when there is exactly 1 half time event and no full time event exists
  const isFullTimeDisabled = (halfTimeCount !== 1 && halfTimeCount !== 3 && halfTimeCount !== 4) || fullTimeCount > 0;

  // Check if match is currently live - events can only be added when match is live
  const isMatchLive = match.status === MatchStatus.Live;

  // Handler for half time - adds a half time event
  const [addingHalfTime, setAddingHalfTime] = useState(false);
  const handleHalfTime = async () => {
    setAddingHalfTime(true);
    try {
      await onAddEvent({
        matchId: match.id,
        type: MatchEventType.HalfTime,
        minute: halfTimeMinute,
        teamId: match.firstOpponent.id, // teamId is required by the type, using first team as placeholder
      });
    } finally {
      setAddingHalfTime(false);
    }
  };

  // Handler for full time - adds a full time event and ends the match
  const [addingFullTime, setAddingFullTime] = useState(false);
  const handleFullTime = async () => {
    setAddingFullTime(true);
    try {
      await onAddEvent({
        matchId: match.id,
        type: MatchEventType.FullTime,
        minute: Math.floor(currentMinute),
        teamId: match.firstOpponent.id, // teamId is required by the type, using first team as placeholder
      });
      await onEndMatch();
    } finally {
      setAddingFullTime(false);
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
            <Badge variant="outline" className={statusConfig.className}>
              <Clock className="h-3 w-3 mr-1" />
              {match.status === MatchStatus.Live ? `${statusConfig.label} - ${currentMinute}'` : statusConfig.label}
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
          {!isMatchLive && (
            <p className="text-sm text-muted-foreground">
              Events can only be added when the match is live.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_EVENTS_ROW1.map((event) => {
              const Icon = event.icon;
              return (
                <AddEventDialog
                  key={event.type}
                  matchId={match.id}
                  teams={teams}
                  currentMinute={currentMinute}
                  events={events}
                  onAddEvent={onAddEvent}
                  mode="quick"
                  presetType={event.type}
                  trigger={
                    <Button
                      variant="outline"
                      className={cn('h-auto flex-col gap-2 py-4', event.color)}
                      disabled={!isMatchLive}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{event.label}</span>
                    </Button>
                  }
                />
              );
            })}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            {QUICK_EVENTS_ROW2.map((event) => {
              const Icon = event.icon;
              return (
                <AddEventDialog
                  key={event.type}
                  matchId={match.id}
                  teams={teams}
                  currentMinute={currentMinute}
                  events={events}
                  onAddEvent={onAddEvent}
                  mode="quick"
                  presetType={event.type}
                  trigger={
                    <Button
                      variant="outline"
                      className={cn('h-auto flex-col gap-2 py-4', event.color)}
                      disabled={!isMatchLive}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{event.label}</span>
                    </Button>
                  }
                />
              );
            })}
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              onClick={handleHalfTime}
              disabled={!isMatchLive || addingHalfTime || isHalfTimeDisabled}
              className="flex-1"
            >
              {addingHalfTime ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Half Time ({halfTimeMinute}&apos;)
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleFullTime}
              disabled={!isMatchLive || addingFullTime || isFullTimeDisabled}
              className="flex-1 bg-red-500 hover:bg-red-600"
            >
              {addingFullTime ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ending...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Full Time
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
