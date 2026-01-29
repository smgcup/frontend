import { BackButton } from '@/components/BackButton';

const LeaderboardLoading = () => {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Header - orange predictor theme */}
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

      {/* Content */}
      <section className="pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto" />
            <div className="mt-2 h-5 w-64 bg-muted rounded animate-pulse mx-auto" />
          </div>

          {/* Top 3 Podium Skeleton */}
          <div className="flex flex-row justify-center items-end gap-2 sm:gap-4 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-muted animate-pulse mb-2 sm:mb-3 border-2 sm:border-4 border-border" />
              <div className="bg-muted rounded-t-lg w-20 h-16 sm:w-28 sm:h-24 animate-pulse" />
            </div>
            <div className="flex flex-col items-center -mt-4 sm:-mt-8">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-muted animate-pulse mb-2 sm:mb-3 border-2 sm:border-4 border-border" />
              <div className="bg-muted rounded-t-lg w-24 h-24 sm:w-32 sm:h-32 animate-pulse border-t-2 sm:border-t-4 border-border" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-muted animate-pulse mb-2 sm:mb-3 border-2 sm:border-4 border-border" />
              <div className="bg-muted rounded-t-lg w-20 h-14 sm:w-28 sm:h-20 animate-pulse" />
            </div>
          </div>

          {/* Table Skeleton - 7 columns: Pos, Player, Pts, Exact, Outcomes, Preds, Acc% */}
          <div className="rounded-lg border bg-card p-6 shadow-sm ring-1 ring-orange-500/10">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-muted animate-pulse" />
              <div className="h-7 w-32 rounded bg-muted animate-pulse" />
            </div>
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-orange-500/20">
                    <th className="px-3 py-3 text-center">
                      <div className="h-4 w-8 bg-muted rounded animate-pulse mx-auto" />
                    </th>
                    <th className="px-4 py-3 text-left">
                      <div className="h-4 w-14 bg-muted rounded animate-pulse" />
                    </th>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <th key={i} className="px-3 py-3 text-center">
                        <div className="h-4 w-10 bg-muted rounded animate-pulse mx-auto" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <tr key={i} className="border-b">
                      <td className="px-3 py-4 text-center">
                        <div className="w-8 h-8 rounded-full bg-muted animate-pulse mx-auto" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="h-5 w-8 bg-muted rounded animate-pulse mx-auto" />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="h-5 w-6 bg-muted rounded animate-pulse mx-auto" />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="h-5 w-6 bg-muted rounded animate-pulse mx-auto" />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="h-5 w-6 bg-muted rounded animate-pulse mx-auto" />
                      </td>
                      <td className="px-3 py-4 text-center">
                        <div className="h-5 w-10 bg-muted rounded animate-pulse mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Leaderboard updates after each match is completed
          </p>
        </div>
      </section>
    </div>
  );
};

export default LeaderboardLoading;
