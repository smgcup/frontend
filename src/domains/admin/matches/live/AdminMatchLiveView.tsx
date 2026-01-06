'use client';

import AdminMatchLiveViewUi from './AdminMatchLiveViewUi';
import { MatchEventType } from './components/EventTimeline';

export { MatchEventType };

type AdminMatchLiveViewProps = {
  matchId: string;
};

// Mock data for UI - replace with actual hook later
const AdminMatchLiveView = ({ matchId }: AdminMatchLiveViewProps) => {
  const match: Parameters<typeof AdminMatchLiveViewUi>[0]['match'] = {
    id: matchId,
    firstOpponent: {
      id: 'team1',
      name: '12A',
      players: [
        { id: 'p1', firstName: 'John', lastName: 'Doe' },
        { id: 'p2', firstName: 'Jane', lastName: 'Smith' },
        { id: 'p3', firstName: 'Mike', lastName: 'Johnson' },
        { id: 'p4', firstName: 'Sarah', lastName: 'Williams' },
        { id: 'p5', firstName: 'David', lastName: 'Brown' },
      ],
    },
    secondOpponent: {
      id: 'team2',
      name: '12B',
      players: [
        { id: 'p6', firstName: 'Alex', lastName: 'Davis' },
        { id: 'p7', firstName: 'Emma', lastName: 'Wilson' },
        { id: 'p8', firstName: 'Chris', lastName: 'Taylor' },
        { id: 'p9', firstName: 'Lisa', lastName: 'Anderson' },
        { id: 'p10', firstName: 'Tom', lastName: 'Martinez' },
      ],
    },
    date: new Date().toISOString(),
    status: 'LIVE',
    score1: 2,
    score2: 1,
  };

  const events: Parameters<typeof AdminMatchLiveViewUi>[0]['events'] = [
    {
      id: 'e1',
      type: MatchEventType.GOAL,
      minute: 12,
      player: { id: 'p1', firstName: 'John', lastName: 'Doe' },
      team: { id: 'team1', name: '12A', players: [] },
    },
    {
      id: 'e2',
      type: MatchEventType.YELLOW_CARD,
      minute: 18,
      player: { id: 'p6', firstName: 'Alex', lastName: 'Davis' },
      team: { id: 'team2', name: '12B', players: [] },
    },
    {
      id: 'e3',
      type: MatchEventType.GOAL,
      minute: 25,
      player: { id: 'p2', firstName: 'Jane', lastName: 'Smith' },
      team: { id: 'team1', name: '12A', players: [] },
    },
    {
      id: 'e4',
      type: MatchEventType.GOALKEEPER_SAVE,
      minute: 32,
      player: { id: 'p10', firstName: 'Tom', lastName: 'Martinez' },
      team: { id: 'team2', name: '12B', players: [] },
    },
    {
      id: 'e5',
      type: MatchEventType.GOAL,
      minute: 38,
      player: { id: 'p7', firstName: 'Emma', lastName: 'Wilson' },
      team: { id: 'team2', name: '12B', players: [] },
    },
    {
      id: 'e6',
      type: MatchEventType.HALF_TIME,
      minute: 45,
      team: { id: 'team1', name: '12A', players: [] },
    },
  ];

  const matchLoading = false;
  const currentMinute = 67;
  const onAddEvent = async (_data: {
    type: MatchEventType;
    minute: number;
    playerId?: string;
    teamId: string;
  }) => {};
  const onEndMatch = async () => {};

  return (
    <AdminMatchLiveViewUi
      match={match}
      events={events}
      matchLoading={matchLoading}
      currentMinute={currentMinute}
      onAddEvent={onAddEvent}
      onEndMatch={onEndMatch}
    />
  );
};

export default AdminMatchLiveView;

