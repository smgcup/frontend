export const CATEGORIES = {
  Goals: 'Goals',
  Assists: 'Assists',
  TotalPasses: 'Total Passes',
  CleanSheets: 'Clean Sheets',
} as const;

export type CategoryType = (typeof CATEGORIES)[keyof typeof CATEGORIES];
