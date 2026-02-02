import { predictorTheme } from '@/lib/gamemodeThemes';
import { cn } from '@/lib/utils';
import { Clock, Trophy } from 'lucide-react';

const MyPredictionsLoading = () => {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-b from-primary/10 to-background">
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
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-5 w-5 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-8 sm:h-9 w-16 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {/* Upcoming Predictions Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Clock className={cn('h-5 w-5', predictorTheme.iconAccent)} />
            <h2 className="text-2xl font-bold">Upcoming Predictions</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-68 rounded-xl bg-muted/50 border border-border animate-pulse" />
            ))}
          </div>
        </div>

        {/* Past Predictions Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Trophy className={cn('h-5 w-5', predictorTheme.iconAccent)} />
            <h2 className="text-2xl font-bold">Past Predictions</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-68 rounded-xl bg-muted/50 border border-border animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPredictionsLoading;
