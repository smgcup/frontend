import type { MatchEventType } from '@/generated/types';

export type AddEventInput = {
  type: MatchEventType;
  minute: number;
  playerId?: string;
  teamId: string;
};
