import { getClient } from '@/lib/initializeApollo';
import { GetNewsByIdDocument, GetNewsByIdQuery, GetNewsByIdQueryVariables } from '@/graphql';
import { mapNews } from '@/domains/news/mappers/mapNews';

export const getNewsDetail = async (newsId: string) => {
  const client = await getClient();

  const { data, error } = await client.query<GetNewsByIdQuery, GetNewsByIdQueryVariables>({
    query: GetNewsByIdDocument,
    variables: { newsByIdId: newsId },
  });

  const news = data?.newsById ? mapNews(data.newsById) : null;

  return { news, error };
};
