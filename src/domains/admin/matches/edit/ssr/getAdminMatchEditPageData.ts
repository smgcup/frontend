import { getClient } from '@/lib/initializeApollo';
import { TeamsDocument, TeamsQuery, TeamsQueryVariables } from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';

export const getAdminMatchEditPageData = async () => {
  const client = await getClient();

  const { data: teamsData, error } = await client.query<TeamsQuery, TeamsQueryVariables>({
    query: TeamsDocument,
  });

  const teams = teamsData?.teams.map(mapTeam) ?? [];

  // Ensure this is safe to pass into client components (must be serializable).
  const errorMessage = error
    ? typeof error === 'object' && error && 'message' in error
      ? String((error as { message?: unknown }).message ?? 'Failed to load teams.')
      : 'Failed to load teams.'
    : null;

  return { teams, errorMessage };
};
