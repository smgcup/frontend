import AdminTeamsViewUi from './AdminTeamsViewUi';
import { getClient } from '@/lib/apollo-rsc';
import { TeamsWithPlayersDocument, TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables } from '@/graphql';

const AdminTeamsView = async () => {
  const client = await getClient();

  const { data, error } = await client.query<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>({
    query: TeamsWithPlayersDocument,
  });

  const teams = data?.teams ?? [];

  return <AdminTeamsViewUi teams={teams} error={error} />;
};

export default AdminTeamsView;
