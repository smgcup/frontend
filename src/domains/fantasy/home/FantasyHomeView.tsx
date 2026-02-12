'use client';

import FantasyHomeViewUi from './FantasyHomeViewUi';
import type { FantasyHomeData } from '../contracts';

// TODO: Replace with real API data
const mockHomeData: FantasyHomeData = {
  teamName: 'Nasko FC',
  managerName: 'Nasko',
  currentGameweek: 1,
  currentGameweekPoints: 17,
  averagePoints: 37,
  highestPoints: 134,
  nextGameweek: 2,
  nextDeadline: new Date('2026-03-01T11:30:00'),
};

const FantasyHomeView = () => {
  return <FantasyHomeViewUi data={mockHomeData} />;
};

export default FantasyHomeView;
