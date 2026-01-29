import { Target, Star, Zap, Trophy, Clock, AlertCircle, LogIn } from 'lucide-react';
import Link from 'next/link';
import { MatchStatus } from '@/graphql';
import { getMyPredictionsPageData } from '@/domains/predictor/ssr/getMyPredictionsPageData';
import PredictionResultCard from '@/domains/predictor/components/PredictionResultCard';
import { Button } from '@/components/ui/button';
import { predictorTheme } from '@/lib/gamemodeThemes';
import { cn } from '@/lib/utils';

const MyPredictionsPage = async () => {
  const { predictions, stats, error, isAuthError } = await getMyPredictionsPageData();

  // Auth error - show login prompt
  if (isAuthError) {
    return (
      <div className="min-h-[calc(100vh-60px)]">
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

        <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <LogIn className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Login Required</h3>
            <p className="text-muted-foreground mb-6">Sign in to view your predictions and track your progress.</p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Other error - show error message
  if (error) {
    return (
      <div className="min-h-[calc(100vh-60px)]">
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

        <div className="container mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-destructive/10 rounded-xl border border-destructive/20">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load predictions</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Group predictions by status
  const upcomingPredictions = predictions.filter(
    (pred) => pred.match.status === MatchStatus.Scheduled || pred.match.status === MatchStatus.Live,
  );
  const pastPredictions = predictions.filter((pred) => pred.match.status === MatchStatus.Finished);

  if (!stats) {
    throw new Error('Stats are required but were not provided');
  }

  const statsDisplay = [
    { icon: <Target className="h-5 w-5" />, label: 'Exact Hits', value: stats.exactMatchesCount.toString() },
    {
      icon: <Star className="h-5 w-5" />,
      label: 'Correct Outcome',
      value: stats.correctOutcomesCount.toString(),
    },
    { icon: <Zap className="h-5 w-5" />, label: 'Total Points', value: stats.totalPoints.toString() },
    {
      icon: <Trophy className="h-5 w-5" />,
      label: 'Total Predictions',
      value: stats.totalPredictionsCount.toString(),
    },
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
          {statsDisplay.map((stat, index) => (
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
              <Clock className={cn('h-5 w-5', predictorTheme.iconAccent)} />
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
              <Trophy className={cn('h-5 w-5', predictorTheme.iconAccent)} />
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
            <p className="text-muted-foreground mb-6">Start making predictions to see them here.</p>
            <Button asChild>
              <Link href="/games/predictor">Make Predictions</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPredictionsPage;
