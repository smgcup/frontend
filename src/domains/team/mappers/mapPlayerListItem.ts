import type { Player } from '@/domains/player/contracts';
import { PlayerPosition, PreferredFoot } from '@/graphql';

const toNumber = (v: number | string | null | undefined, fallback = 0) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
};

const toDateString = (v: unknown): string | undefined => {
  if (!v) return undefined;
  const date = new Date(v as string | number);
  if (isNaN(date.getTime())) return undefined;
  return date.toISOString().split('T')[0];
};

const isPlayerPosition = (v: unknown): v is PlayerPosition => {
  return typeof v === 'string' && Object.values(PlayerPosition).includes(v as PlayerPosition);
};

const isPreferredFoot = (v: unknown): v is PreferredFoot => {
  return typeof v === 'string' && Object.values(PreferredFoot).includes(v as PreferredFoot);
};

export const mapPlayerListItem = (player: Player): Player => {
  return {
    id: player.id,
    firstName: player.firstName ?? '',
    lastName: player.lastName ?? '',
    position: isPlayerPosition(player.position) ? player.position : PlayerPosition.Goalkeeper,
    dateOfBirth: toDateString(player?.dateOfBirth),
    height: toNumber(player.height),
    weight: toNumber(player.weight),
    preferredFoot: isPreferredFoot(player.preferredFoot) ? player.preferredFoot : PreferredFoot.Right,
  };
};
