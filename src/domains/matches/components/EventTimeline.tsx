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

const formatMatchTime = (event: MatchEvent, chronologicalHalfTimes: MatchEvent[]) => {
  const eventMinute = typeof event.minute === 'number' ? event.minute : 0;
  const minutes = Math.floor(eventMinute);
  const fraction = eventMinute - minutes;

  // Determine which half this event belongs to
  // Find the most recent half-time event that occurred before or at this event's minute
  let mostRecentHalfTimeIndex = -1;
  for (let i = chronologicalHalfTimes.length - 1; i >= 0; i--) {
    const halfTimeMinute = typeof chronologicalHalfTimes[i].minute === 'number' ? chronologicalHalfTimes[i].minute : 0;
    if (halfTimeMinute <= eventMinute) {
      mostRecentHalfTimeIndex = i;
      break;
    }
  }

  // Determine base time for the current half
  // Base times: 45' (first half), 90' (second half), 105' (first extra time), 120' (second extra time)
  let baseTime: number;
  if (mostRecentHalfTimeIndex === -1) {
    // No half-time event before this event, it's in the first half
    baseTime = 45;
  } else {
    // The event is in the half that starts after the most recent half-time
    // Index 0 (45' half-time) -> second half (base 90')
    // Index 1 (90' half-time) -> first extra time (base 105')
    // Index 2 (105' half-time) -> second extra time (base 120')
    baseTime = mostRecentHalfTimeIndex === 0 ? 90 : mostRecentHalfTimeIndex === 1 ? 105 : 120;
  }

  // Check if event is in added time (exceeds base time for its half)
  if (eventMinute > baseTime) {
    const addedTime = Math.floor(eventMinute - baseTime);
    return `${baseTime}' + ${addedTime}`;
  }

  // Normal formatting for events within base time
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

  // Sort events chronologically (ascending) to determine half-time event order
  const chronologicalHalfTimes = [...events]
    .filter((e) => e.type === MatchEventType.HalfTime)
    .sort((a, b) => {
      const aTime = typeof a.minute === 'number' ? a.minute : 0;
      const bTime = typeof b.minute === 'number' ? b.minute : 0;
      if (aTime !== bTime) {
        return aTime - bTime;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  // Create a map of half-time event ID to its chronological index
  const halfTimeIndexMap = new Map<string, number>();
  chronologicalHalfTimes.forEach((event, index) => {
    halfTimeIndexMap.set(event.id, index);
  });

  const sorted = [...events].sort((a, b) => {
    const aTime = typeof a.minute === 'number' ? a.minute : 0;
    const bTime = typeof b.minute === 'number' ? b.minute : 0;
    // Sort by minute descending (newest first)
    if (bTime !== aTime) {
      return bTime - aTime;
    }
    // If same minute, sort by createdAt descending (later added events on top)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getHalfTimeLabel = (event: MatchEvent): string => {
    const index = halfTimeIndexMap.get(event.id) ?? 0;
    // 0: 45' (first half), 1: 90' (second half), 2: 105' (first extra time), 3: 120' (second extra time)
    if (index === 0) {
      return 'Half-time';
    }
    if (index === 1) {
      return 'Full time';
    }
    if (index === 2) {
      return 'End of 1st half of extra time';
    }
    if (index === 3) {
      return 'End of 2nd half of extra time';
    }
    return 'Half-time';
  };

  const getFullTimeLabel = (event: MatchEvent): string => {
    // Check if there's a 1st half of extra time event (index 2)
    const firstExtraTimeHalf = chronologicalHalfTimes[2];
    if (firstExtraTimeHalf) {
      const eventTime = typeof event.minute === 'number' ? event.minute : 0;
      const firstExtraTimeMinute = typeof firstExtraTimeHalf.minute === 'number' ? firstExtraTimeHalf.minute : 0;
      const eventCreatedAt = new Date(event.createdAt).getTime();
      const firstExtraTimeCreatedAt = new Date(firstExtraTimeHalf.createdAt).getTime();

      // If FullTime event occurs after 1st half of extra time (by minute or by creation time)
      if (
        eventTime > firstExtraTimeMinute ||
        (eventTime === firstExtraTimeMinute && eventCreatedAt > firstExtraTimeCreatedAt)
      ) {
        return 'End of 2nd half of extra time';
      }
    }
    return 'Full time';
  };

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
          const label = event.type === MatchEventType.FullTime ? getFullTimeLabel(event) : getHalfTimeLabel(event);
          return (
            <div key={event.id} className="relative py-2">
              <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center w-full rounded-xl bg-muted/40 py-3 px-4 text-base font-medium text-muted-foreground">
                <div></div>
                <span className="text-center">{label}</span>
                <div className="flex justify-end">
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
                      <Trash2 className={cn('h-4 w-4 text-white', deletingEventId === event.id && 'opacity-50')} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        }

        const isFirstTeam = event.player && event.player.team?.name === firstOpponentName;
        const time = formatMatchTime(event, chronologicalHalfTimes);
        const playerName = event.player ? `${event.player.firstName} ${event.player.lastName}` : undefined;
        const assistPlayerName = event.assistPlayer
          ? `${event.assistPlayer.firstName} ${event.assistPlayer.lastName}`
          : undefined;
        const leftText = isFirstTeam ? playerName : time;
        const rightText = isFirstTeam ? time : playerName;

        return (
          <div key={event.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 py-1">
            <div className={cn('min-w-0', isFirstTeam ? 'text-right' : 'text-right text-muted-foreground font-mono')}>
              {isFirstTeam ? (
                <div className="flex flex-col items-end">
                  <span className={cn('inline-block truncate font-semibold')}>{leftText}</span>
                  {assistPlayerName && (
                    <span className="text-xs text-muted-foreground/60 truncate">{assistPlayerName}</span>
                  )}
                </div>
              ) : (
                <span className={cn('inline-block truncate text-sm')}>{leftText}</span>
              )}
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
              {isFirstTeam ? (
                <span className={cn('inline-block truncate text-sm')}>{rightText}</span>
              ) : (
                <div className="flex flex-col min-w-0">
                  <span className={cn('inline-block truncate font-semibold')}>{rightText}</span>
                  {assistPlayerName && (
                    <span className="text-xs text-muted-foreground/60 truncate">{assistPlayerName}</span>
                  )}
                </div>
              )}
              {onDeleteEvent && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteEvent(event.id)}
                  disabled={Boolean(deletingEventId)}
                  className="h-7 w-7 shrink-0 ml-auto"
                  aria-label="Delete event"
                  title="Delete event"
                >
                  <Trash2 className={cn('h-4 w-4 text-white', deletingEventId === event.id && 'opacity-50')} />
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
