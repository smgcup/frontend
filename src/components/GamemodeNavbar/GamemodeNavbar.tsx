'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logoPng from '@/public/favicon.png';
import { Button } from '../ui/';
import { ArrowLeft, Menu, X, Trophy, Home, ListChecks, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { gamemodeThemes, type GamemodeTheme } from '@/lib/gamemodeThemes';

type GamemodeConfig = {
  name: string;
  basePath: string;
  theme: GamemodeTheme;
  navItems: { title: string; url: string; icon: React.ReactNode }[];
};

const gamemodeConfigs: Record<string, GamemodeConfig> = {
  predictor: {
    name: 'Predictor',
    basePath: '/games/predictor',
    theme: 'orange',
    navItems: [
      { title: 'Predict', url: '/games/predictor', icon: <Home className="h-4 w-4" /> },
      { title: 'My Predictions', url: '/games/predictor/my-predictions', icon: <ListChecks className="h-4 w-4" /> },
      { title: 'Leaderboard', url: '/games/predictor/leaderboard', icon: <Trophy className="h-4 w-4" /> },
    ],
  },
  fantasy: {
    name: 'Fantasy',
    basePath: '/games/fantasy',
    theme: 'emerald',
    navItems: [
      { title: 'My Team', url: '/games/fantasy', icon: <Home className="h-4 w-4" /> },
      { title: 'Leaderboard', url: '/games/fantasy/leaderboard', icon: <Trophy className="h-4 w-4" /> },
    ],
  },
};

type GamemodeNavbarProps = {
  gamemode: 'predictor' | 'fantasy';
};

const GamemodeNavbar = ({ gamemode }: GamemodeNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  const config = gamemodeConfigs[gamemode];
  const theme = gamemodeThemes[config.theme];

  const isActive = (url: string) => {
    if (url === config.basePath) {
      return pathname === url;
    }
    return pathname.startsWith(url);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Backdrop overlay - outside nav for proper stacking */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm transition-all duration-300 py-2 lg:py-3">
        <div className="w-screen px-6">
          {/* Desktop navigation */}
          <div className="hidden items-center lg:grid lg:grid-cols-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="gap-2">
                <Link href="/games">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Games
                </Link>
              </Button>
              <div className="h-6 w-px bg-border" />
              <Link href={config.basePath} className="flex items-center gap-2">
                <Image
                  src={logoPng || '/placeholder.svg'}
                  alt="SMG Cup Championship Logo"
                  width={40}
                  height={40}
                  className="transition-all duration-300"
                />
                <span className="font-bold tracking-tight text-lg text-foreground">{config.name}</span>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1">
              {config.navItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.url)
                      ? cn(theme.bg, 'text-white')
                      : cn('text-muted-foreground', theme.hover, 'hover:text-foreground'),
                  )}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              {isLoading ? (
                <div className={cn('h-9 w-24 rounded-lg animate-pulse', theme.bg, 'opacity-50')} />
              ) : isAuthenticated && user ? (
                <>
                  <div
                    className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border', theme.bgLight, theme.border)}
                  >
                    <User className={cn('h-4 w-4', theme.text)} />
                    <span className={cn('text-sm font-medium', theme.text)}>
                      {user.username || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-9 cursor-pointer gap-2 px-2.5"
                    onClick={logout}
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <Button asChild size="sm" className={cn(theme.bg, 'hover:opacity-90 text-white border-0')}>
                  <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>Login to Play</Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="h-9 w-9">
                  <Link href="/games">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <Link href={config.basePath} className="flex items-center gap-2">
                  <Image src={logoPng || '/placeholder.svg'} alt="SMG Cup Championship Logo" width={32} height={32} />
                  <span className="font-bold tracking-tight text-foreground">{config.name}</span>
                </Link>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="relative h-9 w-9 bg-transparent"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu
                  className={cn(
                    'h-4 w-4 transition-all duration-300',
                    isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100',
                  )}
                />
                <X
                  className={cn(
                    'absolute h-4 w-4 transition-all duration-300',
                    isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0',
                  )}
                />
              </Button>
            </div>
            <div
              className={cn(
                'absolute left-0 right-0 top-full z-50 overflow-hidden transition-all duration-300 ease-in-out border-t bg-background shadow-lg px-6',
                isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none',
              )}
            >
              <nav className="flex flex-col py-4 gap-1">
                {config.navItems.map((item) => (
                  <Link
                    key={item.url}
                    href={item.url}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.url)
                        ? cn(theme.bg, 'text-white')
                        : cn('text-muted-foreground', theme.hover, 'hover:text-foreground'),
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ))}
                <div className="pt-2 mt-2 border-t">
                  {isLoading ? (
                    <div className={cn('h-9 w-full rounded-lg animate-pulse', theme.bg, 'opacity-50')} />
                  ) : isAuthenticated && user ? (
                    <div
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-lg border',
                        theme.bgLight,
                        theme.border,
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <User className={cn('h-4 w-4', theme.text)} />
                        <span className={cn('text-sm font-medium', theme.text)}>
                          {user.username || user.email?.split('@')[0] || 'User'}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={logout}
                        aria-label="Log out"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      className={cn('w-full', theme.bg, 'hover:opacity-90 text-white border-0')}
                    >
                      <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>Login to Play</Link>
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default GamemodeNavbar;
