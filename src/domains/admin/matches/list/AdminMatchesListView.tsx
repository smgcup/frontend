'use client';

import AdminMatchesListViewUi from './AdminMatchesListViewUi';

// Mock data for UI - replace with actual hook later
const AdminMatchesListView = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(now);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const matches: Parameters<typeof AdminMatchesListViewUi>[0]['matches'] = [
    {
      id: '1',
      firstOpponent: { id: 'team1', name: '12A' },
      secondOpponent: { id: 'team2', name: '12B' },
      date: now.toISOString(),
      status: 'LIVE',
      score1: 2,
      score2: 1,
    },
    {
      id: '2',
      firstOpponent: { id: 'team3', name: '11A' },
      secondOpponent: { id: 'team4', name: '11B' },
      date: tomorrow.toISOString(),
      status: 'SCHEDULED',
    },
    {
      id: '3',
      firstOpponent: { id: 'team5', name: '10A' },
      secondOpponent: { id: 'team6', name: '10B' },
      date: yesterday.toISOString(),
      status: 'FINISHED',
      score1: 3,
      score2: 1,
    },
    {
      id: '4',
      firstOpponent: { id: 'team7', name: '9A' },
      secondOpponent: { id: 'team8', name: '9B' },
      date: nextWeek.toISOString(),
      status: 'SCHEDULED',
    },
    {
      id: '5',
      firstOpponent: { id: 'team9', name: '8A' },
      secondOpponent: { id: 'team10', name: '8B' },
      date: lastWeek.toISOString(),
      status: 'FINISHED',
      score1: 0,
      score2: 2,
    },
    {
      id: '6',
      firstOpponent: { id: 'team11', name: '7A' },
      secondOpponent: { id: 'team12', name: '7B' },
      date: lastWeek.toISOString(),
      status: 'FINISHED',
      score1: 1,
      score2: 1,
    },
    {
      id: '7',
      firstOpponent: { id: 'team1', name: '12A' },
      secondOpponent: { id: 'team3', name: '11A' },
      date: nextWeek.toISOString(),
      status: 'SCHEDULED',
    },
    {
      id: '8',
      firstOpponent: { id: 'team2', name: '12B' },
      secondOpponent: { id: 'team4', name: '11B' },
      date: yesterday.toISOString(),
      status: 'CANCELLED',
    },
  ];

  const matchesLoading = false;
  const matchesError = undefined;
  const deleteLoading = false;
  const onDeleteMatch = async (_id: string) => {};

  return (
    <AdminMatchesListViewUi
      matches={matches}
      matchesLoading={matchesLoading}
      matchesError={matchesError}
      deleteLoading={deleteLoading}
      onDeleteMatch={onDeleteMatch}
    />
  );
};

export default AdminMatchesListView;

