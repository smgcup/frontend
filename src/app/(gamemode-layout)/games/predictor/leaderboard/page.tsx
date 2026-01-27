import { Trophy, AlertCircle } from 'lucide-react';
import { getLeaderboardPageData } from '@/domains/predictor/ssr/getLeaderboardPageData';
import { BackButton } from '@/components/BackButton';
import PredictorLeaderboardTable from '@/domains/predictor/components/PredictorLeaderboardTable';
import { getDisplayName } from '@/domains/predictor/utils/getDisplayName';

const LeaderboardPage = async () => {
  const { leaderboard, error } = await getLeaderboardPageData();

  if (error) {
    return (
      <div className="min-h-[calc(100vh-60px)]">
        <div className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-primary/5">
          <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Leaderboard</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Top predictors ranked by points and accuracy
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-destructive/10 rounded-xl border border-destructive/20">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load leaderboard</h3>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="min-h-[calc(100vh-60px)]">
        <div className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-primary/5">
          <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Leaderboard</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Top predictors ranked by points and accuracy
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-muted-foreground">Be the first to make predictions and climb the leaderboard!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Header - orange predictor theme */}
      <div className="relative overflow-hidden bg-linear-to-b from-orange-500/10 via-background to-orange-500/5">
        <div className="relative container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Leaderboard</h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Top predictors ranked by points and accuracy
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 sm:text-3xl">
              Top predictors
            </h2>
            <p className="mt-2 text-muted-foreground">Points, accuracy, and prediction stats</p>
          </div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 1 && (
            <div className="flex flex-row justify-center items-end gap-2 sm:gap-4 mb-12">
              {leaderboard.length >= 2 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2 sm:mb-3 border-2 sm:border-4 border-gray-300">
                    <span className="text-lg sm:text-2xl font-bold">2</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-t-lg w-20 h-16 sm:w-28 sm:h-24 flex flex-col items-center justify-center">
                    <p className="font-semibold text-xs sm:text-sm">{getDisplayName(leaderboard[1].user)}</p>
                    <p className="text-xs text-muted-foreground">{leaderboard[1].totalPoints} pts</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center -mt-4 sm:-mt-8">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2 sm:mb-3 border-2 sm:border-4 border-yellow-500 ring-2 sm:ring-4 ring-yellow-500/20">
                  <Trophy className="h-6 w-6 sm:h-10 sm:w-10 text-yellow-500" />
                </div>
                <div className="bg-linear-to-b from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-900/10 rounded-t-lg w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center border-t-2 sm:border-t-4 border-yellow-500">
                  <p className="font-bold text-sm sm:text-lg">{getDisplayName(leaderboard[0].user)}</p>
                  <p className="text-orange-600 dark:text-orange-400 font-semibold text-xs sm:text-sm">
                    {leaderboard[0].totalPoints} pts
                  </p>
                </div>
              </div>

              {leaderboard.length >= 3 && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2 sm:mb-3 border-2 sm:border-4 border-amber-600">
                    <span className="text-lg sm:text-2xl font-bold text-amber-700 dark:text-amber-500">3</span>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-t-lg w-20 h-14 sm:w-28 sm:h-20 flex flex-col items-center justify-center">
                    <p className="font-semibold text-xs sm:text-sm">{getDisplayName(leaderboard[2].user)}</p>
                    <p className="text-xs text-muted-foreground">{leaderboard[2].totalPoints} pts</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <PredictorLeaderboardTable leaderboard={leaderboard} />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Leaderboard updates after each match is completed
          </p>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardPage;
