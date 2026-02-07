import React from 'react';
import MatchView from '@/domains/matches/MatchView';
import { getMatchesPageData } from '@/domains/matches/ssr/getMatchesPageData';

export const revalidate = 300;

const page = async () => {
  const { matches, error } = await getMatchesPageData();
  return <MatchView matches={matches} error={error} />;
};

export default page;
