import { getClient } from '@/lib/apollo-rsc';
import { TeamsWithPlayersDocument, TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables } from '@/graphql';
import AdminPlayersListViewUi from './AdminPlayersListViewUi';

const AdminPlayersListView = async () => {
  const client = await getClient();
  const currentYear = new Date().getFullYear();

  const { data, error } = await client.query<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>({
    query: TeamsWithPlayersDocument,
  });

  const teams = data?.teams ?? [];
  const players = teams.flatMap((t) => t.players ?? []);

  return <AdminPlayersListViewUi teams={teams} players={players} currentYear={currentYear} error={error} />;
};

export default AdminPlayersListView;
