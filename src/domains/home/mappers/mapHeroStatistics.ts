import { HeroStatistics } from '../contracts';
import { GetHeroStatisticsQuery } from '@/graphql';

const DEFAULT: HeroStatistics = {
  teamsCount: 0,
  matchesPlayedCount: 0,
  totalGoals: 0,
  avgGoalsPerMatch: 0,
};

export const mapHeroStatistics = (
  statistics: GetHeroStatisticsQuery['statistics'] | null | undefined,
): HeroStatistics => {
  if (!statistics) return DEFAULT;

  const avgGoalsPerMatch =
    statistics.matchesPlayedCount > 0 ? Number((statistics.totalGoals / statistics.matchesPlayedCount).toFixed(2)) : 0;

  return {
    teamsCount: statistics.teamsCount,
    matchesPlayedCount: statistics.matchesPlayedCount,
    totalGoals: statistics.totalGoals,
    avgGoalsPerMatch,
  };
};
