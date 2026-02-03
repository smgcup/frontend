'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { goalIcon, redCardIcon, yellowCardIcon } from '@/public/icons';
import type { PlayersPageData } from './contracts';
import StandingsColumn from './components/StandingsColumn';
import { Loader2 } from 'lucide-react';

type PlayerStandingsViewUiProps = {
  data: PlayersPageData;
};

const getCategoryIcon = (title: string) => {
  const iconMap: Record<string, string> = {
    Goals: goalIcon,
    Assists: '🤝',
    'Red Cards': redCardIcon,
    'Yellow Cards': yellowCardIcon,
    'Clean Sheets': '🧤',
  };
  return iconMap[title] ?? goalIcon;
};

const isImagePath = (icon: string) => icon.startsWith('/');

const CategoryIcon = ({ title, alt }: { title: string; alt: string }) => {
  const icon = getCategoryIcon(title);
  if (isImagePath(icon)) {
    return <Image src={icon} alt={alt} width={24} height={24} className="shrink-0 w-6 h-6" />;
  }
  return (
    <span className="shrink-0 w-6 h-6 flex items-center justify-center text-xl leading-none" aria-hidden>
      {icon}
    </span>
  );
};

const PlayerStandingsViewUi = ({ data }: PlayerStandingsViewUiProps) => {
  const { standings, loading, loadingMore, loadMore, hasMore } = data;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Keep ref in sync with loading state
  useEffect(() => {
    isLoadingRef.current = loadingMore || loading;
  }, [loadingMore, loading]);

  // Track which column is visible using IntersectionObserver
  useEffect(() => {
    const contentEl = contentScrollRef.current;
    if (!contentEl) return;

    const columns = contentEl.querySelectorAll('[data-column-index]');
    if (columns.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = parseInt((entry.target as HTMLElement).dataset.columnIndex || '0', 10);
            setActiveIndex(index);
          }
        });
      },
      {
        root: contentEl,
        threshold: 0.5,
      },
    );

    columns.forEach((col) => observer.observe(col));

    return () => observer.disconnect();
  }, [standings.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  if (loading) {
    return (
      <div className="py-4 lg:p-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading players...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Player Standings</h1>

        <div className="relative">
          {/* Sticky header - single header on mobile, all headers on desktop */}
          <div className="sticky top-[66px] lg:top-[86px] z-10 bg-background pb-2">
            {/* Mobile: show only active category */}
            <div className="md:hidden flex items-center gap-2 px-2 py-2">
              <CategoryIcon
                title={standings[activeIndex]?.title ?? 'Goals'}
                alt={standings[activeIndex]?.title ?? ''}
              />
              <span className="text-xl font-bold">{standings[activeIndex]?.title}</span>
            </div>

            {/* Desktop: show all headers */}
            <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-5 md:gap-6">
              {standings.map((category) => (
                <div key={category.title} className="flex items-center gap-2 px-2 py-2">
                  <CategoryIcon title={category.title} alt={category.title} />
                  <span className="text-xl font-bold">{category.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable content */}
          <div
            ref={contentScrollRef}
            className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 xl:grid-cols-5 md:gap-6 snap-x snap-mandatory md:snap-none pb-4 hide-scrollbar"
          >
            {standings.map((category, index) => (
              <div
                key={category.title}
                data-column-index={index}
                className="min-w-[80vw] md:min-w-0 snap-center shrink-0 md:shrink"
              >
                <StandingsColumn category={category} />
              </div>
            ))}
          </div>
        </div>

        {/* Sentinel element for infinite scroll */}
        <div ref={sentinelRef} className="h-1" />

        {/* Footer area - fixed height to prevent layout shift */}
        <div className="flex justify-center items-center h-16">
          {loadingMore ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading more players...</span>
            </>
          ) : !hasMore && standings.length > 0 && standings[0].players.length > 0 ? (
            <span className="text-muted-foreground">All players loaded</span>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default PlayerStandingsViewUi;
