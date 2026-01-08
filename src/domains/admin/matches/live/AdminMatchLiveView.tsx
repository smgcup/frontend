'use client';

import AdminMatchLiveViewUi from './AdminMatchLiveViewUi';
import { useAdminMatchLive } from './hooks/useAdminMatchLive';
import { MatchEventType } from '@/domains/matches/contracts';

export { MatchEventType };

type AdminMatchLiveViewProps = {
  matchId: string;
};

const AdminMatchLiveView = ({ matchId }: AdminMatchLiveViewProps) => {
  const { match, events, matchLoading, currentMinute, onAddEvent, onDeleteEvent, deletingEventId, onEndMatch } =
    useAdminMatchLive(matchId);

  return (
    <AdminMatchLiveViewUi
      match={match}
      events={events}
      matchLoading={matchLoading}
      currentMinute={currentMinute}
      onAddEvent={onAddEvent}
      onDeleteEvent={onDeleteEvent}
      deletingEventId={deletingEventId}
      onEndMatch={onEndMatch}
    />
  );
};

export default AdminMatchLiveView;
