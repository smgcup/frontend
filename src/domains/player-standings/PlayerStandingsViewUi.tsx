'use client';

import { useEffect, useRef } from 'react';
import type { PlayersPageData } from './contracts';
import StandingsColumn from './components/StandingsColumn';
import { Loader2 } from 'lucide-react';

type PlayerStandingsViewUiProps = {
  data: PlayersPageData;
};

const PlayerStandingsViewUi = ({ data }: PlayerStandingsViewUiProps) => {
  const { standings, loading, loadingMore, loadMore, hasMore } = data;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  // Keep ref in sync with loading state
  useEffect(() => {
    isLoadingRef.current = loadingMore || loading;
  }, [loadingMore, loading]);

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

        <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-2 xl:grid-cols-5 md:gap-6 snap-x snap-mandatory md:snap-none pb-4 hide-scrollbar">
          {standings.map((category) => (
            <StandingsColumn key={category.title} category={category} />
          ))}
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
