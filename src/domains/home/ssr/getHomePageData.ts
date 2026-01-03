import { getClient } from '@/lib/initializeApollo';
import {
	TeamsDocument,
	TeamsQuery,
	TeamsQueryVariables,
	GetNewsDocument,
	GetNewsQuery,
	GetNewsQueryVariables,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapNews } from '@/domains/news/mappers/mapNews';

export const getHomePageData = async () => {
	const client = await getClient();

	const { data: teamsData, error: teamsError } = await client.query<
		TeamsQuery,
		TeamsQueryVariables
	>({
		query: TeamsDocument,
	});

	const { data: newsData, error: newsError } = await client.query<
		GetNewsQuery,
		GetNewsQueryVariables
	>({
		query: GetNewsDocument,
	});
	const teams = teamsData?.teams.map(mapTeam) ?? [];
	const news = newsData?.news.map(mapNews) ?? [];

	const error = teamsError || newsError;

	return { teams, news, error };
};
