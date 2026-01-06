'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Goal, AlertTriangle, Ban, Shield, Target, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export enum MatchEventType {
  GOAL = 'GOAL',
  YELLOW_CARD = 'YELLOW_CARD',
  RED_CARD = 'RED_CARD',
  GOALKEEPER_SAVE = 'GOALKEEPER_SAVE',
  PENALTY_SCORED = 'PENALTY_SCORED',
  PENALTY_MISSED = 'PENALTY_MISSED',
  HALF_TIME = 'HALF_TIME',
  FULL_TIME = 'FULL_TIME',
}

type MatchEvent = {
  id: string;
  type: MatchEventType;
  minute: number;
  player?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  team: {
    id: string;
    name: string;
  };
};

type EventTimelineProps = {
  events: MatchEvent[];
  firstOpponentName: string;
  secondOpponentName: string;
};

const getEventIcon = (type: MatchEventType) => {
  switch (type) {
    case MatchEventType.GOAL:
      return <Goal className="h-4 w-4" />;
    case MatchEventType.YELLOW_CARD:
      return <AlertTriangle className="h-4 w-4" />;
    case MatchEventType.RED_CARD:
      return <Ban className="h-4 w-4" />;
    case MatchEventType.GOALKEEPER_SAVE:
      return <Shield className="h-4 w-4" />;
    case MatchEventType.PENALTY_SCORED:
      return <Target className="h-4 w-4" />;
    case MatchEventType.PENALTY_MISSED:
      return <X className="h-4 w-4" />;
    case MatchEventType.HALF_TIME:
    case MatchEventType.FULL_TIME:
      return <Clock className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

const getEventLabel = (type: MatchEventType) => {
  switch (type) {
    case MatchEventType.GOAL:
      return 'Goal';
    case MatchEventType.YELLOW_CARD:
      return 'Yellow Card';
    case MatchEventType.RED_CARD:
      return 'Red Card';
    case MatchEventType.GOALKEEPER_SAVE:
      return 'Goalkeeper Save';
    case MatchEventType.PENALTY_SCORED:
      return 'Penalty Scored';
    case MatchEventType.PENALTY_MISSED:
      return 'Penalty Missed';
    case MatchEventType.HALF_TIME:
      return 'Half Time';
    case MatchEventType.FULL_TIME:
      return 'Full Time';
    default:
      return 'Event';
  }
};

const getEventColor = (type: MatchEventType) => {
  switch (type) {
    case MatchEventType.GOAL:
    case MatchEventType.PENALTY_SCORED:
      return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
    case MatchEventType.YELLOW_CARD:
      return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
    case MatchEventType.RED_CARD:
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    case MatchEventType.GOALKEEPER_SAVE:
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    case MatchEventType.PENALTY_MISSED:
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    case MatchEventType.HALF_TIME:
    case MatchEventType.FULL_TIME:
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    default:
      return 'bg-primary/10 text-primary border-primary/20';
  }
};

const EventTimeline = ({ events, firstOpponentName, secondOpponentName }: EventTimelineProps) => {
  if (events.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground text-center">No events yet</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Add events as they happen during the match</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const isFirstTeam = event.team.name === firstOpponentName;
        return (
          <div
            key={event.id}
            className={cn(
              'flex items-start gap-4 p-4 rounded-lg border bg-card transition-all',
              isFirstTeam ? 'border-l-4 border-l-primary' : 'border-r-4 border-r-primary'
            )}
          >
            <div className="shrink-0">
              <Badge variant="outline" className={cn('font-semibold', getEventColor(event.type))}>
                <span className="flex items-center gap-1.5">
                  {getEventIcon(event.type)}
                  {getEventLabel(event.type)}
                </span>
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  {event.player ? (
                    <p className="font-medium">
                      {event.player.firstName} {event.player.lastName}
                    </p>
                  ) : (
                    <p className="font-medium">{event.team.name}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{event.team.name}</p>
                </div>
                <div className="shrink-0">
                  <Badge variant="outline" className="font-mono">
                    {event.minute}'
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventTimeline;

