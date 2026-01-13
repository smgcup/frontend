import type { Player } from '@/domains/player/contracts';
import type { Team } from '@/domains/team/contracts';
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

const isEnumValue = <T extends Record<string, string>>(enumObj: T, v: unknown): v is T[keyof T] => {
  return typeof v === 'string' && (Object.values(enumObj) as string[]).includes(v);
};

export const mapPlayerEdit = (player: Player, team?: Team): Player => {
  const position = isEnumValue(PlayerPosition, player.position) ? player.position : PlayerPosition.Goalkeeper;
  const preferredFoot = isEnumValue(PreferredFoot, player.preferredFoot) ? player.preferredFoot : PreferredFoot.Right;

  return {
    id: player.id,
    firstName: player.firstName ?? '',
    lastName: player.lastName ?? '',
    dateOfBirth: toDateString(player?.dateOfBirth),
    height: toNumber(player.height),
    weight: toNumber(player.weight),
    imageUrl: player.imageUrl ?? null,
    position,
    preferredFoot,
    ...(team !== undefined ? { team } : {}),
  };
};
