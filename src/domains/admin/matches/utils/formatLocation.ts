import { MatchLocation } from '@/generated/types';
import type { Match } from '@/domains/matches/contracts';

/**
 * Formats a match location enum value into a human-readable string.
 * Returns '-' if the location is null or undefined.
 *
 * @param location - The match location (MatchLocation enum value, null, or undefined)
 * @returns Formatted location string ('SMG Arena', 'CK Green Sport', or '-')
 */
export const formatLocation = (location: Match['location']): string => {
  if (!location) {
    return '-';
  }
  const locationMap: Record<MatchLocation, string> = {
    [MatchLocation.SmgArena]: 'SMG Arena',
    [MatchLocation.CkGreenSport]: 'CK Green Sport',
  };
  return locationMap[location] || location;
};
