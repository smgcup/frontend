import { getPublicClient } from '@/lib/initializeApollo';
import { GetNewsDocument } from '@/graphql';
import { mapNews } from '@/domains/news/mappers/mapNews';

export const getNewsPageData = async () => {
  try {
    const client = getPublicClient();
    const { data } = await client.query({ query: GetNewsDocument });
    const news = data?.news.map(mapNews) ?? [];
    return { news, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
    return { news: [], error: errorMessage };
  }
};
