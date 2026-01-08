import { getClient } from '@/lib/initializeApollo';
import { GetNewsDocument, GetNewsQuery, GetNewsQueryVariables } from '@/graphql';
import { mapNews } from '../mappers/mapNews';

export const getNewsPageData = async () => {
  const client = await getClient();

  const { data, error: newsError } = await client.query<GetNewsQuery, GetNewsQueryVariables>({
    query: GetNewsDocument,
  });
  const news = data?.news.map(mapNews) ?? [];

  const error = newsError;
  return { news, error };
};
