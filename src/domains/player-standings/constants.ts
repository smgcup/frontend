export const CATEGORIES = {
  Goals: 'Goals',
  Assists: 'Assists',
  CleanSheets: 'Clean Sheets',
  RedCards: 'Red Cards',
  YellowCards: 'Yellow Cards',
} as const;

export type CategoryType = (typeof CATEGORIES)[keyof typeof CATEGORIES];
