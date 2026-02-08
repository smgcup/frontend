'use client';

import FantasyViewUi from './FantasyViewUi';
import type { FantasyTeamData } from './contracts';

const mockTeam: FantasyTeamData = {
  teamName: 'Nasko FC',
  gameweek: 1,
  gameweekDate: 'Sat 7 Dec 13:00',
  latestPoints: 17,
  averagePoints: 37,
  highestPoints: 134,
  gwRank: 11,
  transfers: 0,
  freeTransfers: 2,
  cost: 0,
  budget: 2,
  starters: [
    {
      id: '1',
      name: 'Neuer',
      position: 'GK',
      points: 12,
      jersey: { color: '#EAB308', textColor: '#1E1B4B', label: 'А' },
    },
    {
      id: '2',
      name: 'V. van Dijk',
      position: 'DEF',
      points: 7,
      jersey: { color: '#166534', textColor: '#FFFFFF', label: 'Е' },
    },
    {
      id: '3',
      name: 'Ramos',
      position: 'DEF',
      points: 23,
      jersey: { color: '#1C1917', textColor: '#FFFFFF', label: '10' },
    },
    {
      id: '4',
      name: 'De Bruyne',
      position: 'MID',
      points: 31,
      jersey: { color: '#DBEAFE', textColor: '#1E40AF', label: 'Б' },
      isCaptain: true,
    },
    {
      id: '5',
      name: 'Modrić',
      position: 'MID',
      points: 16,
      jersey: { color: '#DBEAFE', textColor: '#1E40AF', label: 'Б' },
    },
    {
      id: '6',
      name: 'Haaland',
      position: 'FWD',
      points: 34,
      jersey: { color: '#7DD3FC', textColor: '#1E3A5F', label: 'Г' },
    },
  ],
  bench: [
    {
      id: '7',
      name: 'Vini Jr.',
      position: 'GK',
      points: 5,
      jersey: { color: '#EAB308', textColor: '#1E1B4B', label: 'А' },
    },
    {
      id: '8',
      name: 'Bellingham',
      position: 'MID',
      points: 19,
      jersey: { color: '#166534', textColor: '#FFFFFF', label: 'Е' },
    },
    {
      id: '9',
      name: 'Messi',
      position: 'FWD',
      points: 28,
      jersey: { color: '#1C1917', textColor: '#FFFFFF', label: '10' },
    },
    {
      id: '10',
      name: 'Son',
      position: 'DEF',
      points: 7,
      jersey: { color: '#DBEAFE', textColor: '#1E40AF', label: 'Б' },
    },
  ],
};

const FantasyView = () => {
  return <FantasyViewUi team={mockTeam} />;
};

export default FantasyView;
