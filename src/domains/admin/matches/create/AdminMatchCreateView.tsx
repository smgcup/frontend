'use client';

import AdminMatchCreateViewUi from './AdminMatchCreateViewUi';

// Mock data for UI - replace with actual hook later
const AdminMatchCreateView = () => {
  const teams: Parameters<typeof AdminMatchCreateViewUi>[0]['teams'] = [
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

  const createLoading = false;
  const onCreateMatch = async (_data: Parameters<typeof AdminMatchCreateViewUi>[0]['onCreateMatch'] extends (data: infer T) => any ? T : never) => {};

  return <AdminMatchCreateViewUi teams={teams} onCreateMatch={onCreateMatch} createLoading={createLoading} />;
};

export default AdminMatchCreateView;

