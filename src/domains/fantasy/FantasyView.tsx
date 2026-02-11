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

import { PlayerPosition } from '@/graphql';
import FantasyViewUi from './FantasyViewUi';
import type { FantasyTeamData, FantasyAvailablePlayer } from './contracts';

// TODO: Replace with real API data. This mock represents the user's current team.
const mockTeam: FantasyTeamData = {
  teamName: 'Nasko FC',
  latestPoints: 17,
  averagePoints: 37,
  highestPoints: 134,
  freeTransfers: 6,
  gameweek: 1,
  budget: 3,
  starters: [
    {
      id: '1',
      firstName: 'Manuel',
      lastName: 'Neuer',
      displayName: 'Neuer',
      position: PlayerPosition.Goalkeeper,
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
      firstName: 'Virgil',
      lastName: 'van Dijk',
      displayName: 'V. van Dijk',
      position: PlayerPosition.Defender,
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
      firstName: 'Sergio',
      lastName: 'Ramos',
      displayName: 'Ramos',
      position: PlayerPosition.Defender,
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
      firstName: 'Kevin',
      lastName: 'De Bruyne',
      displayName: 'De Bruyne',
      position: PlayerPosition.Midfielder,
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
      firstName: 'Luka',
      lastName: 'Modric',
      displayName: 'Modric',
      position: PlayerPosition.Midfielder,
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
      firstName: 'Erling',
      lastName: 'Haaland',
      displayName: 'Haaland',
      position: PlayerPosition.Forward,
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
      firstName: 'Robert',
      lastName: 'Sanchez',
      displayName: 'Sanchez',
      position: PlayerPosition.Defender,
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
      firstName: 'Jude',
      lastName: 'Bellingham',
      displayName: 'Bellingham',
      position: PlayerPosition.Midfielder,
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
      firstName: 'Lionel',
      lastName: 'Messi',
      displayName: 'Messi',
      position: PlayerPosition.Forward,
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
  { id: 'p1', firstName: 'Mohamed', lastName: 'Salah', displayName: 'M. Salah', teamShort: 'LIV', position: PlayerPosition.Midfielder, price: 13.0, points: 156 },
  { id: 'p2', firstName: 'Erling', lastName: 'Haaland', displayName: 'Haaland', teamShort: 'MCI', position: PlayerPosition.Forward, price: 13.5, points: 142 },
  { id: 'p3', firstName: 'Kevin', lastName: 'De Bruyne', displayName: 'De Bruyne', teamShort: 'MCI', position: PlayerPosition.Midfielder, price: 10.2, points: 128 },
  { id: 'p4', firstName: 'Heung-min', lastName: 'Son', displayName: 'Son Heung-min', teamShort: 'TOT', position: PlayerPosition.Midfielder, price: 9.8, points: 112 },
  { id: 'p5', firstName: 'Bukayo', lastName: 'Saka', displayName: 'B. Saka', teamShort: 'ARS', position: PlayerPosition.Midfielder, price: 9.5, points: 108 },
  { id: 'p6', firstName: 'Cole', lastName: 'Palmer', displayName: 'Palmer', teamShort: 'CHE', position: PlayerPosition.Midfielder, price: 9.2, points: 134 },
  { id: 'p7', firstName: 'Virgil', lastName: 'van Dijk', displayName: 'V. van Dijk', teamShort: 'LIV', position: PlayerPosition.Defender, price: 6.5, points: 89 },
  { id: 'p8', firstName: 'Ruben', lastName: 'Dias', displayName: 'Dias', teamShort: 'MCI', position: PlayerPosition.Defender, price: 6.0, points: 78 },
  { id: 'p9', firstName: 'Trent', lastName: 'Alexander-Arnold', displayName: 'Alexander-Arnold', teamShort: 'LIV', position: PlayerPosition.Defender, price: 7.5, points: 95 },
  { id: 'p10', firstName: 'Ollie', lastName: 'Watkins', displayName: 'Watkins', teamShort: 'AVL', position: PlayerPosition.Forward, price: 8.5, points: 98 },
  { id: 'p11', firstName: 'Alexander', lastName: 'Isak', displayName: 'Isak', teamShort: 'NEW', position: PlayerPosition.Forward, price: 8.8, points: 105 },
  { id: 'p12', firstName: 'Manuel', lastName: 'Neuer', displayName: 'Neuer', teamShort: 'BAY', position: PlayerPosition.Goalkeeper, price: 5.5, points: 82 },
  { id: 'p13', firstName: 'Robert', lastName: 'Sanchez', displayName: 'Sanchez', teamShort: 'CHE', position: PlayerPosition.Goalkeeper, price: 4.9, points: 68 },
  { id: 'p14', firstName: 'David', lastName: 'Raya', displayName: 'Raya', teamShort: 'ARS', position: PlayerPosition.Goalkeeper, price: 5.0, points: 85 },
  { id: 'p15', firstName: 'Emiliano', lastName: 'Martinez', displayName: 'Martinez', teamShort: 'AVL', position: PlayerPosition.Goalkeeper, price: 4.8, points: 72 },
  { id: 'p16', firstName: 'William', lastName: 'Saliba', displayName: 'Saliba', teamShort: 'ARS', position: PlayerPosition.Defender, price: 6.2, points: 86 },
  { id: 'p17', firstName: 'John', lastName: 'Stones', displayName: 'Stones', teamShort: 'MCI', position: PlayerPosition.Defender, price: 5.5, points: 62 },
  { id: 'p18', firstName: 'Gabriel', lastName: 'Magalhaes', displayName: 'Gabriel', teamShort: 'ARS', position: PlayerPosition.Defender, price: 6.0, points: 84 },
  { id: 'p19', firstName: 'Jude', lastName: 'Bellingham', displayName: 'Bellingham', teamShort: 'RMA', position: PlayerPosition.Midfielder, price: 8.5, points: 102 },
  { id: 'p20', firstName: 'Martin', lastName: 'Odegaard', displayName: 'Odegaard', teamShort: 'ARS', position: PlayerPosition.Midfielder, price: 8.0, points: 88 },
  { id: 'p21', firstName: 'Declan', lastName: 'Rice', displayName: 'Rice', teamShort: 'ARS', position: PlayerPosition.Midfielder, price: 6.5, points: 76 },
  { id: 'p22', firstName: 'James', lastName: 'Maddison', displayName: 'Maddison', teamShort: 'TOT', position: PlayerPosition.Midfielder, price: 7.0, points: 74 },
  { id: 'p23', firstName: 'Julian', lastName: 'Alvarez', displayName: 'Alvarez', teamShort: 'ATM', position: PlayerPosition.Forward, price: 7.5, points: 68 },
  { id: 'p24', firstName: 'Darwin', lastName: 'Nunez', displayName: 'Nunez', teamShort: 'LIV', position: PlayerPosition.Forward, price: 7.2, points: 58 },
  { id: 'p25', firstName: 'Kai', lastName: 'Havertz', displayName: 'Havertz', teamShort: 'ARS', position: PlayerPosition.Forward, price: 7.5, points: 82 },
  { id: 'p26', firstName: 'Sergio', lastName: 'Ramos', displayName: 'Ramos', teamShort: 'PSG', position: PlayerPosition.Defender, price: 5.0, points: 56 },
  { id: 'p27', firstName: 'Luka', lastName: 'Modric', displayName: 'Modric', teamShort: 'RMA', position: PlayerPosition.Midfielder, price: 7.8, points: 72 },
  { id: 'p28', firstName: 'Lionel', lastName: 'Messi', displayName: 'Messi', teamShort: 'MIA', position: PlayerPosition.Forward, price: 11.0, points: 94 },
  { id: 'p29', firstName: 'Kylian', lastName: 'Mbappe', displayName: 'Mbappe', teamShort: 'RMA', position: PlayerPosition.Forward, price: 12.0, points: 118 },
  { id: 'p30', firstName: 'Vinicius', lastName: 'Jr', displayName: 'Vinicius Jr', teamShort: 'RMA', position: PlayerPosition.Forward, price: 10.5, points: 110 },
];

const FantasyView = () => {
  return <FantasyViewUi team={mockTeam} availablePlayers={mockAvailablePlayers} />;
};

export default FantasyView;
