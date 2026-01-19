import { Zap, Timer, Users, ShieldCheck, LayoutGrid, Trophy, Target, TrendingUp, Award, Gamepad2 } from 'lucide-react';
import GameCard from './components/GameCard';
import type { Gamemode } from './contracts';

const games: Gamemode[] = [
  {
    title: 'Predictor',
    subtitle: 'Match Prophecy',
    badge: {
      text: 'Popular',
      variant: 'popular',
    },
    backgroundImage: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    href: '/games/predictor',
    stats: [
      {
        icon: <Zap className="h-5 w-5" />,
        label: '500 Pts',
      },
      {
        icon: <Timer className="h-5 w-5" />,
        label: '14:02:44',
      },
      {
        icon: <Users className="h-5 w-5" />,
        label: '12.4k',
      },
    ],
  },
  {
    title: 'Fantasy',
    subtitle: 'Dream Team Builder',
    badge: {
      text: 'New Season',
      variant: 'new-season',
    },
    backgroundImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2093&auto=format&fit=crop',
    href: '/games/fantasy',
    stats: [
      {
        icon: <ShieldCheck className="h-5 w-5" />,
        label: 'Elite',
      },
      {
        icon: <LayoutGrid className="h-5 w-5" />,
        label: 'Gameweek 1',
      },
      {
        icon: <Trophy className="h-5 w-5" />,
        label: '$10k',
      },
    ],
  },
];

const features = [
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Predict & Win',
    description: 'Forecast match outcomes and earn points for correct predictions.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Climb the Ranks',
    description: 'Compete on global leaderboards and track your progress over time.',
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Earn Rewards',
    description: 'Win prizes and unlock achievements as you play.',
  },
];

const GamesViewUi = () => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative">
        {/* Hero Section */}
        <section className="bg-linear-to-b from-muted/30 to-transparent">
          <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm">
                <Gamepad2 className="h-4 w-4" />
                <span>Game Hub</span>
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Choose Your <span className="text-primary">Game</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Put your football knowledge to the test. Predict match outcomes or build your dream team and compete against players worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
              {games.map((game, index) => (
                <GameCard key={index} {...game} />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/50 bg-muted/30 py-12 sm:py-16">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
                How It Works
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex flex-col items-center rounded-2xl border border-border/50 bg-background/50 p-6 text-center backdrop-blur-sm transition-colors hover:border-border hover:bg-background"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      {feature.icon}
                    </div>
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GamesViewUi;
