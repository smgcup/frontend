'use client';

import AdminMatchLiveViewUi from './AdminMatchLiveViewUi';
import { useAdminMatchLive } from './hooks/useAdminMatchLive';
import type { Match, MatchEvent } from '@/domains/matches/contracts';

type AdminMatchLiveViewProps = {
  matchId: string;
  initialMatch: Match;
  initialEvents: MatchEvent[];
};

const AdminMatchLiveView = ({ matchId, initialMatch, initialEvents }: AdminMatchLiveViewProps) => {
  const { events, currentMinute, onAddEvent, onDeleteEvent, deletingEventId, onEndMatch } = useAdminMatchLive(
    matchId,
    initialEvents,
  );

  return (
    <AdminMatchLiveViewUi
      match={initialMatch}
      events={events}
      currentMinute={currentMinute}
      onAddEvent={onAddEvent}
      onDeleteEvent={onDeleteEvent}
      deletingEventId={deletingEventId}
      onEndMatch={onEndMatch}
    />
  );
};

export default AdminMatchLiveView;
