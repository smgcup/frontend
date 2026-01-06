'use client';

import AdminMatchEditViewUi from './AdminMatchEditViewUi';

type AdminMatchEditViewProps = {
  matchId: string;
};

// Mock data for UI - replace with actual hook later
const AdminMatchEditView = ({ matchId }: AdminMatchEditViewProps) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const match: Parameters<typeof AdminMatchEditViewUi>[0]['match'] = {
    id: matchId,
    firstOpponent: { id: 'team1', name: '12A' },
    secondOpponent: { id: 'team2', name: '12B' },
    date: tomorrow.toISOString(),
    status: 'SCHEDULED',
  };

  const teams: Parameters<typeof AdminMatchEditViewUi>[0]['teams'] = [
    { id: 'team1', name: '12A' },
    { id: 'team2', name: '12B' },
    { id: 'team3', name: '11A' },
    { id: 'team4', name: '11B' },
    { id: 'team5', name: '10A' },
    { id: 'team6', name: '10B' },
    { id: 'team7', name: '9A' },
    { id: 'team8', name: '9B' },
    { id: 'team9', name: '8A' },
    { id: 'team10', name: '8B' },
  ];

  const matchLoading = false;
  const updateLoading = false;
  const onUpdateMatch = async (_data: Parameters<typeof AdminMatchEditViewUi>[0]['onUpdateMatch'] extends (data: infer T) => any ? T : never) => {};

  return (
    <AdminMatchEditViewUi
      match={match}
      teams={teams}
      matchLoading={matchLoading}
      updateLoading={updateLoading}
      onUpdateMatch={onUpdateMatch}
    />
  );
};

export default AdminMatchEditView;

