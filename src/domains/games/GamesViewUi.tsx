import React from 'react';
import Link from 'next/link';
import { ArrowRight, Target, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type ThemeClasses, predictorTheme, fantasyTheme } from '@/lib/gamemodeThemes';

type GameCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  href: string;
  theme: ThemeClasses;
  disabled?: boolean;
  backgroundImage?: string;
};

const GameCard = ({ title, description, icon, badge, href, theme, disabled, backgroundImage }: GameCardProps) => {
  const CardContent = (
    <div
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300',
        !disabled && 'hover:shadow-2xl hover:scale-102',
        !disabled && theme.shadow,
        disabled && 'opacity-50 grayscale',
      )}
    >
      {/* Background image with hover zoom (enlarges beyond card) */}
      {backgroundImage && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="h-full w-full bg-cover bg-center grayscale transition-transform duration-500 ease-out group-hover:scale-125"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-card/70 backdrop-blur-[2px]" />
        </div>
      )}

      {/* Animated gradient background */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 transition-opacity duration-500',
          !disabled && 'group-hover:opacity-100',
          theme.gradientOverlay,
        )}
      />

      {/* Top accent line */}
      <div className={cn('relative z-1 h-1 w-full', theme.gradientLine)} />

      <div className="relative z-1 flex flex-col h-full p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300',
              theme.bgLight,
              !disabled && 'group-hover:scale-110',
            )}
          >
            <div className={theme.text}>{icon}</div>
          </div>
          {badge && (
            <span
              className={cn(
                'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold',
                theme.bgLight,
                theme.text,
              )}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="mb-8 flex-1">
          <h2
            className={cn(
              'text-2xl sm:text-3xl font-bold tracking-tight mb-3 transition-colors duration-300',
              !disabled && `group-hover:${theme.text}`,
            )}
          >
            {title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {/* Coming Soon Overlay */}
        {disabled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className={cn('rounded-xl border-2 px-6 py-3 shadow-lg backdrop-blur-sm', theme.border, 'bg-card/90')}>
              <span className={cn('text-sm font-bold uppercase tracking-wider', theme.text)}>Coming Soon</span>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto">
          <div
            className={cn(
              'flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300',
              disabled
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : cn(theme.buttonPrimary, theme.buttonPrimaryHover, 'group-hover:gap-3'),
            )}
          >
            <span>{disabled ? 'Coming Soon' : 'Play Now'}</span>
            {!disabled && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </div>
        </div>
      </div>
    </div>
  );

  if (disabled) {
    return <div className="h-full">{CardContent}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {CardContent}
    </Link>
  );
};

const GamesViewUi = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">Choose Your Game</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Test your football knowledge and compete against SMG CL fans
        </p>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <GameCard
          title="Predictor"
          description="Predict match scores and outcomes."
          icon={<Target className="h-7 w-7" />}
          // badge="Most Popular"
          theme={predictorTheme}
          href="/games/predictor"
          backgroundImage="https://storage.googleapis.com/pod_public/750/169545.jpg"
        />
        <GameCard
          title="Fantasy"
          description="Build your dream team and compete with friends."
          icon={<Star className="h-7 w-7" />}
          badge="New Season"
          theme={fantasyTheme}
          href="/games/fantasy"
          disabled
        />
      </div>
    </div>
  );
};

export default GamesViewUi;
