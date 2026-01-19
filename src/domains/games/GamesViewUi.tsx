import { Zap, Timer, Users, ShieldCheck, LayoutGrid, Trophy } from 'lucide-react';
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

const GamesViewUi = () => {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-64px)]">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Choose Your <span className="text-primary">Game</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Compete with others, track your progress, and prove your football knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          {games.map((game, index) => (
            <GameCard key={index} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesViewUi;
