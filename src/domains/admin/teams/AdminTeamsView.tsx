import AdminTeamsViewUi from './AdminTeamsViewUi';
import { getClient } from '@/lib/apollo-rsc';
import { TeamsDocument, TeamsQuery, TeamsQueryVariables } from '@/graphql';

const AdminTeamsView = async () => {
  const client = await getClient();

  const { data, error } = await client.query<TeamsQuery, TeamsQueryVariables>({
    query: TeamsDocument,
  });

  const teams = data?.teams ?? [];

  return <AdminTeamsViewUi teams={teams} error={error} />;
};

export default AdminTeamsView;
