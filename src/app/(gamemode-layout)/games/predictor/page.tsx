import PredictorView from '@/domains/predictor/PredictorView';
import { getPredictorPageData } from '@/domains/predictor/ssr/getPredictorPageData';

const PredictorPage = async () => {
  let matches;
  let error;

  try {
    const result = await getPredictorPageData();
    matches = result.matches;
    error = result.error;
  } catch (err) {
    error = err;
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground">Unable to load predictor data. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!matches) {
    return (
      <div className="min-h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Matches Found</h2>
          <p className="text-muted-foreground">No matches found. Please try again later.</p>
        </div>
      </div>
    );
  }

  return <PredictorView matches={matches} />;
};

export default PredictorPage;
