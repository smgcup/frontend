import { MatchStatus } from '@/graphql';
import type { Team } from '@/domains/team/contracts';
import type { Match } from '@/domains/matches/contracts';
import type { Prediction } from './contracts';

// Mock teams with class names
export const mockTeams: Team[] = [
  { id: '1', name: '12A' },
  { id: '2', name: '8b' },
  { id: '3', name: '10C' },
  { id: '4', name: '11D' },
  { id: '5', name: '9A' },
  { id: '6', name: '7B' },
  { id: '7', name: '12B' },
  { id: '8', name: '8A' },
];

// Helper to get a team by id
const getTeam = (id: string): Team => mockTeams.find((t) => t.id === id)!;

// Generate dates: some in the past, some in the future
const now = new Date();
const pastDate1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
const pastDate2 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
const pastDate3 = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
const pastDate4 = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
const futureDate1 = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
const futureDate2 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000); // 4 days from now
const futureDate3 = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000); // 6 days from now
const futureDate4 = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000); // 8 days from now

// Mock matches
export const mockMatches: Match[] = [
  // Past matches (Finished)
  {
    id: 'match-1',
    firstOpponent: getTeam('1'),
    secondOpponent: getTeam('2'),
    date: pastDate1.toISOString(),
    status: MatchStatus.Finished,
    score1: 3,
    score2: 1,
    round: 1,
  },
  {
    id: 'match-2',
    firstOpponent: getTeam('3'),
    secondOpponent: getTeam('4'),
    date: pastDate2.toISOString(),
    status: MatchStatus.Finished,
    score1: 2,
    score2: 2,
    round: 1,
  },
  {
    id: 'match-3',
    firstOpponent: getTeam('5'),
    secondOpponent: getTeam('6'),
    date: pastDate3.toISOString(),
    status: MatchStatus.Finished,
    score1: 1,
    score2: 0,
    round: 2,
  },
  {
    id: 'match-4',
    firstOpponent: getTeam('7'),
    secondOpponent: getTeam('8'),
    date: pastDate4.toISOString(),
    status: MatchStatus.Finished,
    score1: 4,
    score2: 2,
    round: 2,
  },
  {
    id: 'match-5',
    firstOpponent: getTeam('1'),
    secondOpponent: getTeam('3'),
    date: pastDate1.toISOString(),
    status: MatchStatus.Finished,
    score1: 0,
    score2: 2,
    round: 1,
  },
  {
    id: 'match-6',
    firstOpponent: getTeam('2'),
    secondOpponent: getTeam('4'),
    date: pastDate2.toISOString(),
    status: MatchStatus.Finished,
    score1: 3,
    score2: 0,
    round: 1,
  },
  // Upcoming matches (Scheduled)
  {
    id: 'match-7',
    firstOpponent: getTeam('5'),
    secondOpponent: getTeam('7'),
    date: futureDate1.toISOString(),
    status: MatchStatus.Scheduled,
    round: 3,
  },
  {
    id: 'match-8',
    firstOpponent: getTeam('6'),
    secondOpponent: getTeam('8'),
    date: futureDate2.toISOString(),
    status: MatchStatus.Scheduled,
    round: 3,
  },
  {
    id: 'match-9',
    firstOpponent: getTeam('1'),
    secondOpponent: getTeam('5'),
    date: futureDate3.toISOString(),
    status: MatchStatus.Scheduled,
    round: 4,
  },
  {
    id: 'match-10',
    firstOpponent: getTeam('2'),
    secondOpponent: getTeam('6'),
    date: futureDate4.toISOString(),
    status: MatchStatus.Scheduled,
    round: 4,
  },
  {
    id: 'match-11',
    firstOpponent: getTeam('3'),
    secondOpponent: getTeam('7'),
    date: futureDate1.toISOString(),
    status: MatchStatus.Scheduled,
    round: 3,
  },
  {
    id: 'match-12',
    firstOpponent: getTeam('4'),
    secondOpponent: getTeam('8'),
    date: futureDate2.toISOString(),
    status: MatchStatus.Scheduled,
    round: 3,
  },
];

// Mock predictions with varied accuracy
export const mockPredictions: Prediction[] = [
  // Past predictions - some exact, some correct outcome, some incorrect
  {
    id: 'pred-1',
    matchId: 'match-1',
    match: mockMatches[0],
    predictedScore1: 3,
    predictedScore2: 1,
    createdAt: pastDate1.toISOString(),
    isExactCorrect: true,
    isOutcomeCorrect: true,
    pointsEarned: 10,
  },
  {
    id: 'pred-2',
    matchId: 'match-2',
    match: mockMatches[1],
    predictedScore1: 2,
    predictedScore2: 2,
    createdAt: pastDate2.toISOString(),
    isExactCorrect: true,
    isOutcomeCorrect: true,
    pointsEarned: 10,
  },
  {
    id: 'pred-3',
    matchId: 'match-3',
    match: mockMatches[2],
    predictedScore1: 2,
    predictedScore2: 0,
    createdAt: pastDate3.toISOString(),
    isExactCorrect: false,
    isOutcomeCorrect: true,
    pointsEarned: 5,
  },
  {
    id: 'pred-4',
    matchId: 'match-4',
    match: mockMatches[3],
    predictedScore1: 1,
    predictedScore2: 3,
    createdAt: pastDate4.toISOString(),
    isExactCorrect: false,
    isOutcomeCorrect: false,
    pointsEarned: 0,
  },
  {
    id: 'pred-5',
    matchId: 'match-5',
    match: mockMatches[4],
    predictedScore1: 1,
    predictedScore2: 3,
    createdAt: pastDate1.toISOString(),
    isExactCorrect: false,
    isOutcomeCorrect: true,
    pointsEarned: 5,
  },
  {
    id: 'pred-6',
    matchId: 'match-6',
    match: mockMatches[5],
    predictedScore1: 3,
    predictedScore2: 0,
    createdAt: pastDate2.toISOString(),
    isExactCorrect: true,
    isOutcomeCorrect: true,
    pointsEarned: 10,
  },
  // Upcoming predictions
  {
    id: 'pred-7',
    matchId: 'match-7',
    match: mockMatches[6],
    predictedScore1: 2,
    predictedScore2: 1,
    createdAt: now.toISOString(),
  },
  {
    id: 'pred-8',
    matchId: 'match-8',
    match: mockMatches[7],
    predictedScore1: 1,
    predictedScore2: 1,
    createdAt: now.toISOString(),
  },
  {
    id: 'pred-9',
    matchId: 'match-9',
    match: mockMatches[8],
    predictedScore1: 3,
    predictedScore2: 2,
    createdAt: now.toISOString(),
  },
  {
    id: 'pred-10',
    matchId: 'match-10',
    match: mockMatches[9],
    predictedScore1: 2,
    predictedScore2: 0,
    createdAt: now.toISOString(),
  },
  {
    id: 'pred-11',
    matchId: 'match-11',
    match: mockMatches[10],
    predictedScore1: 1,
    predictedScore2: 3,
    createdAt: now.toISOString(),
  },
  {
    id: 'pred-12',
    matchId: 'match-12',
    match: mockMatches[11],
    predictedScore1: 4,
    predictedScore2: 1,
    createdAt: now.toISOString(),
  },
];
