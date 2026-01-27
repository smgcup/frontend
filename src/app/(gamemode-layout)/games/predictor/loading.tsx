import { Clock } from 'lucide-react';

const PredictorLoading = () => {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero Section - mirrors PredictorViewUi */}
      <div className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-primary/5">
        <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Score Predictor</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Predict the exact final score for each match. Exact predictions earn bonus points!
            </p>
          </div>

          {/* Scoring Info */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-full bg-muted/50 backdrop-blur-sm px-6 py-2 border border-border text-sm font-medium transition hover:bg-muted/80 disabled:opacity-50 disabled:pointer-events-none"
            >
              View Score Rules
            </button>
          </div>
        </div>
      </div>

      {/* Matches Section - real UI, cards as blank skeletons */}
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold">Upcoming Matches</h2>
            </div>
            <p className="text-muted-foreground">Predict the exact final score for each match before kickoff.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-muted/50 border border-border animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictorLoading;
