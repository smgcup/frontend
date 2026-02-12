import FantasyFixturesView from '@/domains/fantasy/fixtures/FantasyFixturesView';
import { getMatchesPageData } from '@/domains/matches/ssr/getMatchesPageData';

export const revalidate = 300;

const FantasyFixturesPage = async () => {
  const { matches, error } = await getMatchesPageData();
  return <FantasyFixturesView matches={matches} error={error} />;
};

export default FantasyFixturesPage;
