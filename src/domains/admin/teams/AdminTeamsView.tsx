import AdminTeamsViewUi from './AdminTeamsViewUi';
import { getClient } from '@/lib/apollo-rsc';
import { TeamsWithPlayersDocument, TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables } from '@/graphql';
import { mapTeamWithPlayers } from '@/domains/team/mappers/mapTeamWithPlayers';

const AdminTeamsView = async () => {
  const client = await getClient();

  const { data, error } = await client.query<TeamsWithPlayersQuery, TeamsWithPlayersQueryVariables>({
    query: TeamsWithPlayersDocument,
  });

  const teams = (data?.teams ?? []).map((t) => mapTeamWithPlayers(t));

  return <AdminTeamsViewUi teams={teams} error={error} />;
};

export default AdminTeamsView;
