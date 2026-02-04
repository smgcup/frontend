import { getNewsData } from '@/lib/cachedQueries';

export const getNewsPageData = async () => {
  try {
    const news = await getNewsData();
    return { news, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
    return { news: [], error: errorMessage };
  }
};
