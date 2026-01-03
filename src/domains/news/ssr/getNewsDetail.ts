import { getClient } from '@/lib/initializeApollo';
import {
	GetNewsByIdDocument,
	GetNewsByIdQuery,
	GetNewsByIdQueryVariables,
} from '@/graphql';
import { mapNewsById } from '@/domains/news/mappers/mapNews';

export const getNewsDetail = async (newsId: string) => {
	const client = await getClient();

	const { data, error } = await client.query<
		GetNewsByIdQuery,
		GetNewsByIdQueryVariables
	>({
		query: GetNewsByIdDocument,
		variables: { newsByIdId: newsId },
	});

	const news = data?.newsById ? mapNewsById(data.newsById) : null;

	return { news, error };
};
