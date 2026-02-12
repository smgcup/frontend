'use client';

import FantasyFixturesViewUi from './FantasyFixturesViewUi';
import type { Match } from '@/domains/matches/contracts';

type FantasyFixturesViewProps = {
  matches: Match[];
  error?: string | null;
};

const FantasyFixturesView = ({ matches, error }: FantasyFixturesViewProps) => {
  // Group matches by round
  const matchesByRound: Record<number, Match[]> = {};
  for (const match of matches) {
    const round = match.round;
    if (!matchesByRound[round]) {
      matchesByRound[round] = [];
    }
    matchesByRound[round].push(match);
  }

  // Sort matches within each round by date
  for (const round of Object.keys(matchesByRound)) {
    matchesByRound[Number(round)].sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  const rounds = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);
  const totalRounds = rounds.length;

  // Find the latest round that has at least one finished match as "current"
  const currentRound =
    [...rounds].reverse().find((r) =>
      matchesByRound[r].some((m) => m.status === 'FINISHED' || m.status === 'LIVE'),
    ) ?? rounds[0] ?? 1;

  return (
    <FantasyFixturesViewUi
      matchesByRound={matchesByRound}
      rounds={rounds}
      totalRounds={totalRounds}
      currentRound={currentRound}
      error={error}
    />
  );
};

export default FantasyFixturesView;
