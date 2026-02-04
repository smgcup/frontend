import { getMatchesData } from '@/lib/cachedQueries';

export const getMatchesPageData = async () => {
  try {
    const matches = await getMatchesData();
    return { matches, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load matches';
    return { matches: [], error: errorMessage };
  }
};
