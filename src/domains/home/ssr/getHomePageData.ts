import { getClient } from '@/lib/initializeApollo';
import { TeamsDocument, TeamsQuery, TeamsQueryVariables } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';

export const getHomePageData = async () => {
	const client = await getClient();

	const { data: teamsData, error: teamsError } = await client.query<
		TeamsQuery,
		TeamsQueryVariables
	>({
		query: TeamsDocument,
	});
	const teams = teamsData?.teams.map(mapTeam) ?? [];
	const error = teamsError;
	return { teams, error };
};
