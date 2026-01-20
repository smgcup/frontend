import { getMatchesPageData } from '@/domains/matches/ssr/getMatchesPageData';
import PredictorViewUi from './PredictorViewUi';

const PredictorView = async () => {
  const { matches } = await getMatchesPageData();

  return <PredictorViewUi matches={matches} />;
};

export default PredictorView;
