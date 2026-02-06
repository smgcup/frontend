import { getLeaderboardData } from '@/lib/cachedQueries';
import { ALL_SORT_TYPES, SORT_TYPE_TO_CATEGORY } from '../constants';
import type { StandingsCategory } from '../contracts';

const emptyStandings: StandingsCategory[] = ALL_SORT_TYPES.map((sortType) => ({
  title: SORT_TYPE_TO_CATEGORY[sortType],
  players: [],
  hasMore: false,
  totalCount: 0,
}));

export const getPlayerStandingsPageData = async (): Promise<{ standings: StandingsCategory[] }> => {
  try {
    const standings = await getLeaderboardData();
    return { standings };
  } catch {
    return { standings: emptyStandings };
  }
};
