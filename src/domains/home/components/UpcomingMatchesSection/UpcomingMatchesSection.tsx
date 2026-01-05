import Link from 'next/link';
import { Button } from '@/components/ui';
import { ArrowRight, Shield } from 'lucide-react';
import type { Team } from '@/domains/team/contracts';
import type { News } from '@/domains/news/contracts';
import { Reveal } from '@/components/motion/Reveal';

type UpcomingMatchesSectionProps = {
  teams: Team[];
  news: News[];
};
const UpcomingMatchesSection = ({ teams, news }: UpcomingMatchesSectionProps) => {
  const featuredTeams = [...(teams ?? [])]
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 6);

  const latestNews = [...(news ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="container relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Shield className="h-4 w-4" />
                <span>League Snapshot</span>
              </div>
            </Reveal>
            <Reveal delayMs={60}>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Featured Teams
              </h2>
            </Reveal>
            <Reveal delayMs={110}>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
                A quick look at the squads competing this season — plus the latest headline.
              </p>
            </Reveal>
          </div>
          <Reveal delayMs={160} className="flex justify-center sm:justify-end">
            <Button asChild variant="default" size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <Link href="/news">
                Explore News
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {featuredTeams.map((team, idx) => (
                <Reveal key={team.id} delayMs={50 + idx * 40}>
                  <div className="group relative overflow-hidden rounded-xl border bg-card/50 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Team
                        </div>
                        <div className="mt-1 text-2xl font-bold tracking-tight">{team.name}</div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                        {idx + 1}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
              {featuredTeams.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">No teams available yet.</div>
              )}
            </div>
          </div>

          <Reveal delayMs={140}>
            <div className="rounded-2xl border bg-card/60 backdrop-blur-sm p-6 shadow-sm h-full flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Latest headline</div>
                {latestNews ? (
                  <>
                    <div className="mt-2 text-xl font-bold leading-snug line-clamp-3">{latestNews.title}</div>
                    <div className="mt-4 text-sm text-muted-foreground line-clamp-4">{latestNews.content}</div>
                  </>
                ) : (
                  <div className="mt-2 text-muted-foreground">No news yet — check back soon.</div>
                )}
              </div>

              <div className="mt-6">
                <Button asChild size="lg" className="w-full gap-2">
                  <Link href={latestNews ? `/news/${latestNews.id}` : '/news'}>
                    {latestNews ? 'Read latest' : 'Go to news'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default UpcomingMatchesSection;
