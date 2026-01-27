import Link from 'next/link';
import Image from 'next/image';
import HeroStatistic from './HeroStatistic';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { goalIcon, matchIcon, playerIcon, teamIcon } from '@/public/icons';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-primary/5">
      {/* Background Image - Optional */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://raw.githubusercontent.com/BorisAngelov23/smgCLFinalProject/refs/heads/master/static_files/images/smgcl.jpg"
          alt="Tournament Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/60 to-background/80" />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">SMG Champions</span>
            <span className="block text-primary">League</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Experience the excitement of the best school football tournament. Follow your favorite teams, track matches,
            and enjoy every single moment of the competition
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/matches">
                View Matches
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/news">Explore News</Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:flex sm:justify-evenly">
            <div className="w-full max-w-[16rem] sm:max-w-none">
              <HeroStatistic icon={teamIcon} value={16} label="Teams Competing" />
            </div>
            <div className="w-full max-w-[16rem] sm:max-w-none">
              <HeroStatistic icon={matchIcon} value={0} label="Matches Played" />
            </div>
            <div className="w-full max-w-[16rem] sm:max-w-none">
              <HeroStatistic icon={goalIcon} value={0} label="Goals Scored" />
            </div>
            <div className="w-full max-w-[16rem] sm:max-w-none">
              <HeroStatistic icon={playerIcon} value={0} label="Avg Goals/Match" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
