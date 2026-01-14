'use client';

import { Button } from '@/components/ui/button';
import { Clock, Shield, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MatchEvent } from '@/domains/matches/contracts';
import { MatchEventType } from '@/generated/types';

type EventTimelineProps = {
  events: MatchEvent[];
  firstOpponentName: string;
  secondOpponentName: string;
  onDeleteEvent?: (id: string) => Promise<void>;
  deletingEventId?: string | null;
};

const formatMatchTime = (t: number) => {
  const minutes = Math.floor(t);
  const fraction = t - minutes;
  if (fraction <= 0) return `${minutes}'`;

  // Backend often sends mm.ss (e.g. 34.14 => 34'14'')
  const asHundred = Math.round(fraction * 100);
  const asSixty = Math.round(fraction * 60);
  const seconds =
    asHundred >= 0 && asHundred < 60 ? asHundred : asSixty >= 0 && asSixty < 60 ? asSixty : asHundred % 60;

  return `${minutes}'${String(seconds).padStart(2, '0')}''`;
};

const getMarker = (type: MatchEventType) => {
  switch (type) {
    case MatchEventType.YellowCard:
      return <span className="block h-6 w-4 rounded-sm bg-yellow-400" aria-hidden="true" />;
    case MatchEventType.RedCard:
      return <span className="block h-6 w-4 rounded-sm bg-red-500" aria-hidden="true" />;
    case MatchEventType.Goal:
    case MatchEventType.PenaltyScored:
      return (
        <span className="text-xl leading-none" aria-hidden="true">
          ⚽
        </span>
      );
    case MatchEventType.GoalkeeperSave:
      return <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />;
    case MatchEventType.PenaltyMissed:
      return <X className="h-5 w-5 text-muted-foreground" aria-hidden="true" />;
    default:
      return <span className="block h-2 w-2 rounded-full bg-muted-foreground/40" aria-hidden="true" />;
  }
};

const EventTimeline = ({ events, firstOpponentName, onDeleteEvent, deletingEventId }: EventTimelineProps) => {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-center">No events yet</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Events will be added automatically as the match progresses
        </p>
      </div>
    );
  }

  const sorted = [...events].sort((a, b) => {
    const aTime = typeof a.minute === 'number' ? a.minute : 0;
    const bTime = typeof b.minute === 'number' ? b.minute : 0;
    return bTime - aTime;
  });

  return (
    <div
      className={cn(
        'relative space-y-3',
        // Center dotted line
        'before:pointer-events-none before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:border-l before:border-dashed before:border-muted-foreground/30',
      )}
    >
      {sorted.map((event) => {
        if (event.type === MatchEventType.FullTime || event.type === MatchEventType.HalfTime) {
          const label = event.type === MatchEventType.FullTime ? 'Full time' : 'Half-time';
          return (
            <div key={event.id} className="relative py-2">
              <div className="relative z-10 w-full rounded-xl bg-muted/40 py-3 text-center text-base font-medium text-muted-foreground">
                {label}
              </div>
            </div>
          );
        }

        const isFirstTeam = event.player && event.player.team?.name === firstOpponentName;
        const time = formatMatchTime(event.minute);
        const playerName = event.player ? `${event.player.firstName} ${event.player.lastName}` : undefined;
        const leftText = isFirstTeam ? playerName : time;
        const rightText = isFirstTeam ? time : playerName;

        return (
          <div key={event.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 py-1">
            <div className={cn('min-w-0', isFirstTeam ? 'text-right' : 'text-right text-muted-foreground font-mono')}>
              <span className={cn('inline-block truncate', isFirstTeam ? 'font-semibold' : 'text-sm')}>{leftText}</span>
            </div>

            <div
              className="relative z-10 flex h-9 w-9 items-center justify-center"
              aria-label={event.type}
              title={event.type}
            >
              {getMarker(event.type)}
            </div>

            <div
              className={cn(
                'min-w-0 flex items-center gap-2',
                isFirstTeam ? 'text-left text-muted-foreground font-mono' : 'text-left',
              )}
            >
              <span className={cn('inline-block truncate', isFirstTeam ? 'text-sm' : 'font-semibold')}>
                {rightText}
              </span>
              {onDeleteEvent && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteEvent(event.id)}
                  disabled={Boolean(deletingEventId)}
                  className="h-7 w-7 shrink-0"
                  aria-label="Delete event"
                  title="Delete event"
                >
                  <Trash2 className={cn('h-4 w-4', deletingEventId === event.id && 'opacity-50')} />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EventTimeline;
