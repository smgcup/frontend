import type { PlayerListItem } from '@/domains/player/contracts';
import type { PlayerLike } from '@/domains/player/mappers/types';

const toNumber = (v: number | string | null | undefined, fallback = 0) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};

export const mapPlayerListItem = (player: PlayerLike): PlayerListItem => {
  return {
    id: player.id,
    firstName: player.firstName ?? '',
    lastName: player.lastName ?? '',
    position: player.position ?? '',
    yearOfBirth: toNumber(player.yearOfBirth),
    height: toNumber(player.height),
    weight: toNumber(player.weight),
    preferredFoot: player.preferredFoot ?? player.prefferedFoot ?? '',
    imageUrl: player.imageUrl,
  };
};

