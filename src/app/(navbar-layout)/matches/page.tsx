import React from 'react';
import MatchView from '@/domains/matches/MatchView';
import { getMatchesPageData } from '@/domains/matches/ssr/getMatchesPageData';

// ISR: Revalidate every 10 minutes
export const revalidate = 600;

const MatchesPage = async () => {
  const { matches, error } = await getMatchesPageData();
  return <MatchView matches={matches} error={error} />;
};

export default MatchesPage;
