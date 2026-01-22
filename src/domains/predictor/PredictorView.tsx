import PredictorViewUi from './PredictorViewUi';
import type { Match } from '@/domains/matches/contracts';

type PredictorViewProps = {
  matches: Match[];
};

const PredictorView = ({ matches }: PredictorViewProps) => {
  return <PredictorViewUi matches={matches} />;
};

export default PredictorView;
