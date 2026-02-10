// ─── Fantasy Data Layer ────────────────────────────────────────────────
// This is the "View" (data-fetching) component for the main fantasy page.
// Currently uses hardcoded mock data for prototyping.
//
// TODO: Replace mock data with real API calls:
// 1. Fetch the user's team via a GraphQL query (SSR or client-side)
// 2. Fetch available players for the transfer market
// 3. Consider creating an SSR function in `ssr/getFantasyPageData.ts`
//    following the pattern: Page → SSR function → Apollo query → Mapper → View
// 4. Once connected, the mock data below can be deleted entirely.
'use client';

import FantasyViewUi from './FantasyViewUi';
import type { FantasyTeamData, FantasyAvailablePlayer } from './contracts';

// TODO: Replace with real API data. This mock represents the user's current team.
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
      jersey: { color: '#EAB308', textColor: '#1E1B4B', label: '1' },
      nextMatch: 'LEE',
      price: 5.5,
      teamShort: 'BAY',
      ptsPerMatch: 4.0,
      selectedBy: 32.1,
      form: [
        { opponent: 'DOR', points: 6 },
        { opponent: 'LEV', points: 2 },
      ],
      fixtures: [
        { opponent: 'LEE', difficulty: 2, dateTime: 'Sat 14 Dec 15:00' },
        { opponent: 'MCI', difficulty: 5 },
      ],
    },
    {
      id: '2',
      name: 'V. van Dijk',
      position: 'DEF',
      jersey: { color: '#166534', textColor: '#FFFFFF', label: '4' },
      nextMatch: 'MCI',
      price: 6.5,
      teamShort: 'LIV',
      ptsPerMatch: 5.2,
      selectedBy: 45.8,
      form: [
        { opponent: 'WHU', points: 8 },
        { opponent: 'BRE', points: 1 },
      ],
      fixtures: [
        { opponent: 'MCI', difficulty: 5, dateTime: 'Sun 15 Dec 16:30' },
        { opponent: 'BUR', difficulty: 1 },
      ],
    },
    {
      id: '3',
      name: 'Ramos',
      position: 'DEF',
      points: 23,
      jersey: { color: '#1C1917', textColor: '#FFFFFF', label: '4' },
      nextMatch: 'BUR',
      price: 5.0,
      teamShort: 'PSG',
      ptsPerMatch: 4.6,
      selectedBy: 12.4,
      form: [
        { opponent: 'LYO', points: 12 },
        { opponent: 'MAR', points: 6 },
      ],
      fixtures: [
        { opponent: 'BUR', difficulty: 1 },
        { opponent: 'ARS', difficulty: 4, dateTime: 'Wed 18 Dec 20:00' },
      ],
    },
    {
      id: '4',
      name: 'De Bruyne',
      position: 'MID',
      points: 31,
      jersey: { color: '#DBEAFE', textColor: '#1E40AF', label: '17' },
      isCaptain: true,
      nextMatch: 'LIV',
      price: 10.2,
      teamShort: 'MCI',
      ptsPerMatch: 7.8,
      selectedBy: 62.3,
      form: [
        { opponent: 'NEW', points: 15 },
        { opponent: 'CHE', points: 9 },
      ],
      fixtures: [
        { opponent: 'LIV', difficulty: 4, dateTime: 'Sun 15 Dec 16:30' },
        { opponent: 'LEE', difficulty: 2 },
      ],
    },
    {
      id: '5',
      name: 'Modric',
      position: 'MID',
      jersey: { color: '#DBEAFE', textColor: '#1E40AF', label: '10' },
      nextMatch: 'ATM',
      price: 7.8,
      teamShort: 'RMA',
      ptsPerMatch: 5.3,
      selectedBy: 18.7,
      form: [
        { opponent: 'SEV', points: 8 },
        { opponent: 'VIL', points: 3 },
      ],
      fixtures: [
        { opponent: 'ATM', difficulty: 4 },
        { opponent: 'GET', difficulty: 2, dateTime: 'Sat 21 Dec 18:00' },
      ],
    },
    {
      id: '6',
      name: 'Haaland',
      position: 'FWD',
      points: 34,
      jersey: { color: '#7DD3FC', textColor: '#1E3A5F', label: '9' },
      nextMatch: 'LIV',
      price: 13.5,
      teamShort: 'MCI',
      ptsPerMatch: 8.5,
      selectedBy: 78.2,
      form: [
        { opponent: 'NEW', points: 18 },
        { opponent: 'CHE', points: 12 },
      ],
      fixtures: [
        { opponent: 'LIV', difficulty: 4, dateTime: 'Sun 15 Dec 16:30' },
        { opponent: 'LEE', difficulty: 2 },
      ],
    },
  ],
  bench: [
    {
      id: '7',
      name: 'Sanchez',
      position: 'DEF',
      points: 5,
      jersey: { color: '#6B7280', textColor: '#FFFFFF', label: '1' },
      nextMatch: 'LEE',
      price: 4.9,
      teamShort: 'CHE',
      ptsPerMatch: 3.4,
      selectedBy: 8.1,
      form: [
        { opponent: 'AVL', points: 2 },
        { opponent: 'TOT', points: 1 },
      ],
      fixtures: [
        { opponent: 'LEE', difficulty: 2 },
        { opponent: 'NEW', difficulty: 3, dateTime: 'Sat 21 Dec 15:00' },
      ],
    },
    {
      id: '8',
      name: 'Bellingham',
      position: 'MID',
      points: 19,
      jersey: { color: '#166534', textColor: '#FFFFFF', label: '5' },
      nextMatch: 'ATM',
      price: 8.5,
      teamShort: 'RMA',
      ptsPerMatch: 6.3,
      selectedBy: 34.5,
      form: [
        { opponent: 'SEV', points: 11 },
        { opponent: 'VIL', points: 5 },
      ],
      fixtures: [
        { opponent: 'ATM', difficulty: 4, dateTime: 'Sun 15 Dec 21:00' },
        { opponent: 'GET', difficulty: 2 },
      ],
    },
    {
      id: '9',
      name: 'Messi',
      position: 'FWD',
      points: 28,
      jersey: { color: '#1C1917', textColor: '#FFFFFF', label: '10' },
      nextMatch: 'BRA',
      price: 11.0,
      teamShort: 'MIA',
      ptsPerMatch: 7.0,
      selectedBy: 24.9,
      form: [
        { opponent: 'ATL', points: 14 },
        { opponent: 'NYC', points: 10 },
      ],
      fixtures: [
        { opponent: 'BRA', difficulty: 2 },
        { opponent: 'LAG', difficulty: 3 },
      ],
    },
  ],
};

// TODO: Replace with real API data. This mock represents all players available for transfer.
const mockAvailablePlayers: FantasyAvailablePlayer[] = [
  { id: 'p1', name: 'M. Salah', teamShort: 'LIV', position: 'MID', price: 13.0, points: 156 },
  { id: 'p2', name: 'Haaland', teamShort: 'MCI', position: 'FWD', price: 13.5, points: 142 },
  { id: 'p3', name: 'De Bruyne', teamShort: 'MCI', position: 'MID', price: 10.2, points: 128 },
  { id: 'p4', name: 'Son Heung-min', teamShort: 'TOT', position: 'MID', price: 9.8, points: 112 },
  { id: 'p5', name: 'B. Saka', teamShort: 'ARS', position: 'MID', price: 9.5, points: 108 },
  { id: 'p6', name: 'Palmer', teamShort: 'CHE', position: 'MID', price: 9.2, points: 134 },
  { id: 'p7', name: 'V. van Dijk', teamShort: 'LIV', position: 'DEF', price: 6.5, points: 89 },
  { id: 'p8', name: 'Dias', teamShort: 'MCI', position: 'DEF', price: 6.0, points: 78 },
  { id: 'p9', name: 'Alexander-Arnold', teamShort: 'LIV', position: 'DEF', price: 7.5, points: 95 },
  { id: 'p10', name: 'Watkins', teamShort: 'AVL', position: 'FWD', price: 8.5, points: 98 },
  { id: 'p11', name: 'Isak', teamShort: 'NEW', position: 'FWD', price: 8.8, points: 105 },
  { id: 'p12', name: 'Neuer', teamShort: 'BAY', position: 'GK', price: 5.5, points: 82 },
  { id: 'p13', name: 'Sanchez', teamShort: 'CHE', position: 'GK', price: 4.9, points: 68 },
  { id: 'p14', name: 'Raya', teamShort: 'ARS', position: 'GK', price: 5.0, points: 85 },
  { id: 'p15', name: 'Martinez', teamShort: 'AVL', position: 'GK', price: 4.8, points: 72 },
  { id: 'p16', name: 'Saliba', teamShort: 'ARS', position: 'DEF', price: 6.2, points: 86 },
  { id: 'p17', name: 'Stones', teamShort: 'MCI', position: 'DEF', price: 5.5, points: 62 },
  { id: 'p18', name: 'Gabriel', teamShort: 'ARS', position: 'DEF', price: 6.0, points: 84 },
  { id: 'p19', name: 'Bellingham', teamShort: 'RMA', position: 'MID', price: 8.5, points: 102 },
  { id: 'p20', name: 'Odegaard', teamShort: 'ARS', position: 'MID', price: 8.0, points: 88 },
  { id: 'p21', name: 'Rice', teamShort: 'ARS', position: 'MID', price: 6.5, points: 76 },
  { id: 'p22', name: 'Maddison', teamShort: 'TOT', position: 'MID', price: 7.0, points: 74 },
  { id: 'p23', name: 'Alvarez', teamShort: 'ATM', position: 'FWD', price: 7.5, points: 68 },
  { id: 'p24', name: 'Nunez', teamShort: 'LIV', position: 'FWD', price: 7.2, points: 58 },
  { id: 'p25', name: 'Havertz', teamShort: 'ARS', position: 'FWD', price: 7.5, points: 82 },
  { id: 'p26', name: 'Ramos', teamShort: 'PSG', position: 'DEF', price: 5.0, points: 56 },
  { id: 'p27', name: 'Modric', teamShort: 'RMA', position: 'MID', price: 7.8, points: 72 },
  { id: 'p28', name: 'Messi', teamShort: 'MIA', position: 'FWD', price: 11.0, points: 94 },
  { id: 'p29', name: 'Mbappa', teamShort: 'RMA', position: 'FWD', price: 12.0, points: 118 },
  { id: 'p30', name: 'Vinicius Jr', teamShort: 'RMA', position: 'FWD', price: 10.5, points: 110 },
];

const FantasyView = () => {
  return <FantasyViewUi team={mockTeam} availablePlayers={mockAvailablePlayers} />;
};

export default FantasyView;
