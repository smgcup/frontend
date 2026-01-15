import type { MatchEvent } from '../contracts';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';
import { MatchEventsQuery } from '@/graphql';

export const mapMatchEvent = (event: MatchEventsQuery['matchEvents'][number]): MatchEvent => {
  const player = event.player ? mapPlayer(event.player) : undefined;
  const assistPlayer = event.assistPlayer ? mapPlayer(event.assistPlayer) : undefined;

  return {
    id: event.id,
    type: event.type,
    minute: event.minute,
    createdAt: event.createdAt,
    player,
    assistPlayer,
  };
};
