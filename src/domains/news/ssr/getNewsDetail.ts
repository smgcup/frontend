import { getNewsByIdData } from '@/lib/cachedQueries';

export const getNewsDetail = async (newsId: string) => {
  try {
    const news = await getNewsByIdData(newsId);
    return { news, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load news article';
    return { news: null, error: errorMessage };
  }
};
