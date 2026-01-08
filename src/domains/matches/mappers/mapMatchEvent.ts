import type { MatchEvent, MatchEventType } from '../contracts';

type PlayerLike = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  position?: string | null;
};

type TeamLike = {
  id: string;
  name?: string | null;
};

type MatchEventLike = {
  id: string;
  type: MatchEventType | string;
  minute: number;
  payload?: unknown;
  createdAt?: unknown;
  player?: PlayerLike | null;
  team: TeamLike;
};

export const mapMatchEvent = (e: MatchEventLike): MatchEvent => {
  return {
    id: e.id,
    type: e.type as MatchEventType,
    minute: e.minute,
    ...(e.payload == null ? {} : { payload: e.payload }),
    ...(e.createdAt == null ? {} : { createdAt: String(e.createdAt) }),
    ...(e.player
      ? {
          player: {
            id: e.player.id,
            firstName: e.player.firstName ?? '',
            lastName: e.player.lastName ?? '',
            ...(e.player.position == null ? {} : { position: e.player.position }),
          },
        }
      : {}),
    team: { id: e.team.id, name: e.team.name ?? '' },
  };
};
