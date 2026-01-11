import AdminMatchLiveView from '@/domains/admin/matches/live/AdminMatchLiveView';
import { getAdminMatchLivePageData } from '@/domains/admin/matches/live/ssr/getAdminMatchLivePageData';

type AdminMatchLivePageProps = {
  params: Promise<{ id: string }>;
};

const AdminMatchLivePage = async ({ params }: AdminMatchLivePageProps) => {
  const { id } = await params;
  const { match, events, matchErrorMessage, eventsErrorMessage } = await getAdminMatchLivePageData(id);

  if (matchErrorMessage) {
    return <div>Error loading match: {matchErrorMessage}</div>;
  }

  if (eventsErrorMessage) {
    return <div>Error loading events: {eventsErrorMessage}</div>;
  }

  if (!match) {
    return <div>Match not found</div>;
  }

  return <AdminMatchLiveView matchId={id} initialMatch={match} initialEvents={events} />;
};

export default AdminMatchLivePage;
