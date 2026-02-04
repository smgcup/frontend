'use client';

import React from 'react';
import MatchViewUi from './MatchViewUi';

import type { Match } from './contracts';

type MatchViewProps = {
  matches: Match[];
  error?: string | null;
};

const MatchView = ({ matches, error }: MatchViewProps) => {
  return <MatchViewUi matches={matches} error={error} />;
};

export default MatchView;
