'use client';

import { Target, Star, Zap, Trophy, Clock } from 'lucide-react';
import { MatchStatus } from '@/graphql';
import { mockPredictions } from '@/domains/predictor/mockData';
import PredictionResultCard from '@/domains/predictor/components/PredictionResultCard';

const MyPredictionsPage = () => {
  // Group predictions by status
  const upcomingPredictions = mockPredictions.filter(
    (pred) => pred.match.status === MatchStatus.Scheduled || pred.match.status === MatchStatus.Live,
  );
  const pastPredictions = mockPredictions.filter((pred) => pred.match.status === MatchStatus.Finished);

  // Calculate stats from past predictions
  const totalPredictions = pastPredictions.length;
  const exactHits = pastPredictions.filter((pred) => pred.isExactCorrect).length;
  const correctOutcomes = pastPredictions.filter((pred) => pred.isOutcomeCorrect).length;
  const totalPoints = pastPredictions.reduce((sum, pred) => sum + (pred.pointsEarned || 0), 0);

  const stats = [
    { icon: <Target className="h-5 w-5" />, label: 'Exact Hits', value: exactHits.toString() },
    { icon: <Star className="h-5 w-5" />, label: 'Correct Outcome', value: correctOutcomes.toString() },
    { icon: <Zap className="h-5 w-5" />, label: 'Total Points', value: totalPoints.toString() },
    { icon: <Trophy className="h-5 w-5" />, label: 'Total Predictions', value: totalPredictions.toString() },
  ];

  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-primary/5">
        <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">My Predictions</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Track your prediction history and accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                <span className="text-muted-foreground/80">{stat.icon}</span>
              </div>
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Upcoming Predictions */}
        {upcomingPredictions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold">Upcoming Predictions</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {upcomingPredictions.map((prediction) => (
                <PredictionResultCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </div>
        )}

        {/* Past Predictions */}
        {pastPredictions.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold">Past Predictions</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pastPredictions.map((prediction) => (
                <PredictionResultCard key={prediction.id} prediction={prediction} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {upcomingPredictions.length === 0 && pastPredictions.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Predictions Yet</h3>
            <p className="text-muted-foreground">Start making predictions to see them here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPredictionsPage;
