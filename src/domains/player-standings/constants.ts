import { LeaderboardSortType } from '@/graphql';

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
