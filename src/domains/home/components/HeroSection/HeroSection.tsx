import Link from 'next/link';
import Image from 'next/image';
import HeroStatistic from './HeroStatistic';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';
import { goalIcon, matchIcon, teamIcon } from '@/public/icons';
import type { Team } from '@/domains/team/contracts';
import type { News } from '@/domains/news/contracts';
import { Reveal } from '@/components/motion/Reveal';

type HeroSectionProps = {
  teams: Team[];
  news: News[];
};

const HeroSection = ({ teams, news }: HeroSectionProps) => {
  const latestNews = [...(news ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  const daysSinceLatestUpdate = latestNews
    ? Math.max(
        0,
        Math.floor((Date.now() - new Date(latestNews.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      )
    : 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.svg"
          alt=""
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-background/90" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18] mix-blend-overlay dark:opacity-[0.12]"
          style={{ backgroundImage: "url('/noise.svg')" }}
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm text-foreground/80 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">SMG Cup</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {latestNews ? `Updated ${daysSinceLatestUpdate === 0 ? 'today' : `${daysSinceLatestUpdate}d ago`}` : 'Season hub'}
              </span>
            </div>
          </Reveal>

          {/* Main Heading */}
          <Reveal delayMs={60}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">SMG Champions</span>
              <span className="block bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                League
              </span>
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delayMs={110}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Experience the excitement of inter-class football competition. Follow your favorite teams, track matches,
              and celebrate the champions.
            </p>
          </Reveal>

          {latestNews && (
            <Reveal delayMs={160}>
              <div className="mx-auto mt-6 max-w-2xl rounded-2xl border bg-background/55 px-5 py-4 text-left shadow-sm backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Latest headline</div>
                <Link
                  href={`/news/${latestNews.id}`}
                  className="mt-1 block text-base font-semibold leading-snug hover:text-primary transition-colors line-clamp-2"
                >
                  {latestNews.title}
                </Link>
                <div className="mt-3 flex items-center gap-3">
                  <Button asChild size="sm" className="gap-2">
                    <Link href={`/news/${latestNews.id}`}>
                      Read latest
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    View all news
                  </Link>
                </div>
              </div>
            </Reveal>
          )}

          {/* CTA Buttons */}
          <Reveal delayMs={220}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/15">
                <Link href="/matches">
                  View Matches
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-background/40">
                <Link href="/news">Explore News</Link>
              </Button>
            </div>
          </Reveal>

          {/* Quick Stats */}
          <Reveal delayMs={280}>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <HeroStatistic icon={teamIcon} value={teams.length} label="Teams Competing" />
              <HeroStatistic icon={matchIcon} value={news.length} label="News Posts" />
              <HeroStatistic icon={goalIcon} value={daysSinceLatestUpdate} label="Days Since Update" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
