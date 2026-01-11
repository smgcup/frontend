import type { Player } from '@/domains/player/contracts';
import type { PlayerLike } from '@/domains/player/mappers/types';
import { PlayerPosition, PreferredFoot } from '@/graphql';

const toNumber = (v: number | string | null | undefined, fallback = 0) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};

const isPlayerPosition = (v: unknown): v is PlayerPosition => {
  return typeof v === 'string' && Object.values(PlayerPosition).includes(v as PlayerPosition);
};

const isPreferredFoot = (v: unknown): v is PreferredFoot => {
  return typeof v === 'string' && Object.values(PreferredFoot).includes(v as PreferredFoot);
};

export const mapPlayerListItem = (player: PlayerLike): Player => {
  return {
    id: player.id,
    firstName: player.firstName ?? '',
    lastName: player.lastName ?? '',
    position: isPlayerPosition(player.position) ? player.position : PlayerPosition.Goalkeeper,
    yearOfBirth: toNumber(player.yearOfBirth),
    height: toNumber(player.height),
    weight: toNumber(player.weight),
    preferredFoot: isPreferredFoot(player.preferredFoot) ? player.preferredFoot : PreferredFoot.Right,
  };
};
