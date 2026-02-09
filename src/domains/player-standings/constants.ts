import { LeaderboardSortType } from '@/graphql';

export const LEADERBOARD_LIMIT = 20;

// Get the stat value for a player based on the sort type
export const getStatValue = (
  stats: { goals: number; assists: number; yellowCards: number; redCards: number } | null | undefined,
  sortType: LeaderboardSortType,
): number => {
  if (!stats) return 0;
  switch (sortType) {
    case LeaderboardSortType.Goals:
      return stats.goals;
    case LeaderboardSortType.Assists:
      return stats.assists;
    case LeaderboardSortType.YellowCards:
      return stats.yellowCards;
    case LeaderboardSortType.RedCards:
      return stats.redCards;
    case LeaderboardSortType.CleanSheets:
      return 0;
    default:
      return 0;
  }
};

export const CATEGORIES = {
  Goals: 'Goals',
  Assists: 'Assists',
  RedCards: 'Red Cards',
  YellowCards: 'Yellow Cards',
  CleanSheets: 'Clean Sheets',
} as const;

export type CategoryType = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const SORT_TYPE_TO_CATEGORY: Record<LeaderboardSortType, CategoryType> = {
  [LeaderboardSortType.Goals]: CATEGORIES.Goals,
  [LeaderboardSortType.Assists]: CATEGORIES.Assists,
  [LeaderboardSortType.CleanSheets]: CATEGORIES.CleanSheets,
  [LeaderboardSortType.RedCards]: CATEGORIES.RedCards,
  [LeaderboardSortType.YellowCards]: CATEGORIES.YellowCards,
};

// Array of all sort types for iterating
export const ALL_SORT_TYPES = [
  LeaderboardSortType.Goals,
  LeaderboardSortType.Assists,
  LeaderboardSortType.RedCards,
  LeaderboardSortType.YellowCards,
  LeaderboardSortType.CleanSheets,
] as const;
