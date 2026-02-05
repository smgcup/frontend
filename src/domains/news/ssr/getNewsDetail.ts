import { getPublicClient } from '@/lib/initializeApollo';
import { GetNewsByIdDocument } from '@/graphql';
import { mapNews } from '@/domains/news/mappers/mapNews';

export const getNewsDetail = async (newsId: string) => {
  try {
    const client = getPublicClient();
    const { data } = await client.query({
      query: GetNewsByIdDocument,
      variables: { newsByIdId: newsId },
    });
    const news = data?.newsById ? mapNews(data.newsById) : null;
    return { news, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load news article';
    return { news: null, error: errorMessage };
  }
};
