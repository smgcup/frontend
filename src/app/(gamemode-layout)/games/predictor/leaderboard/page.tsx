import { Trophy, Medal, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for the leaderboard
const leaderboardData = [
  { rank: 1, name: 'Alex M.', points: 2450, accuracy: 78, predictions: 45 },
  { rank: 2, name: 'Jordan K.', points: 2380, accuracy: 75, predictions: 48 },
  { rank: 3, name: 'Sam P.', points: 2210, accuracy: 72, predictions: 42 },
  { rank: 4, name: 'Chris L.', points: 2050, accuracy: 70, predictions: 40 },
  { rank: 5, name: 'Taylor R.', points: 1980, accuracy: 68, predictions: 44 },
  { rank: 6, name: 'Morgan S.', points: 1850, accuracy: 65, predictions: 38 },
  { rank: 7, name: 'Casey D.', points: 1720, accuracy: 63, predictions: 36 },
  { rank: 8, name: 'Riley J.', points: 1650, accuracy: 61, predictions: 35 },
  { rank: 9, name: 'Quinn B.', points: 1540, accuracy: 58, predictions: 34 },
  { rank: 10, name: 'Drew H.', points: 1480, accuracy: 56, predictions: 32 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
};

const LeaderboardPage = () => {
  return (
    <div className="min-h-[calc(100vh-60px)]">
      {/* Header */}
      <div className="bg-linear-to-br from-orange-500 via-orange-600 to-amber-600 py-10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Leaderboard</h1>
            <p className="mt-3 text-white/80">Top predictors ranked by points and accuracy</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Top 3 Podium */}
        <div className="hidden md:flex justify-center items-end gap-4 mb-12">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 border-4 border-gray-300">
              <span className="text-2xl font-bold">2</span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-t-lg w-28 h-24 flex flex-col items-center justify-center">
              <p className="font-semibold">{leaderboardData[1].name}</p>
              <p className="text-sm text-muted-foreground">{leaderboardData[1].points} pts</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-8">
            <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-3 border-4 border-yellow-500 ring-4 ring-yellow-500/20">
              <Trophy className="h-10 w-10 text-yellow-500" />
            </div>
            <div className="bg-linear-to-b from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-900/10 rounded-t-lg w-32 h-32 flex flex-col items-center justify-center border-t-4 border-yellow-500">
              <p className="font-bold text-lg">{leaderboardData[0].name}</p>
              <p className="text-orange-600 dark:text-orange-400 font-semibold">{leaderboardData[0].points} pts</p>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3 border-4 border-amber-600">
              <span className="text-2xl font-bold text-amber-700 dark:text-amber-500">3</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-t-lg w-28 h-20 flex flex-col items-center justify-center">
              <p className="font-semibold">{leaderboardData[2].name}</p>
              <p className="text-sm text-muted-foreground">{leaderboardData[2].points} pts</p>
            </div>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
            <div className="col-span-1">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-center">Points</div>
            <div className="col-span-2 text-center hidden sm:block">Accuracy</div>
            <div className="col-span-2 text-center hidden sm:block">Total</div>
          </div>

          {leaderboardData.map((player, index) => (
            <div
              key={player.rank}
              className={cn(
                'grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors hover:bg-muted/30',
                index !== leaderboardData.length - 1 && 'border-b',
                player.rank <= 3 && 'bg-orange-500/5',
              )}
            >
              <div className="col-span-1 flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                {getRankIcon(player.rank)}
              </div>
              <div className="col-span-5">
                <p className="font-semibold">{player.name}</p>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-bold text-orange-600 dark:text-orange-400">{player.points}</span>
              </div>
              <div className="col-span-2 text-center hidden sm:flex items-center justify-center gap-1">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span>{player.accuracy}%</span>
              </div>
              <div className="col-span-2 text-center hidden sm:flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>{player.predictions}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Leaderboard updates after each match is completed
        </p>
      </div>
    </div>
  );
};

export default LeaderboardPage;
