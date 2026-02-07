'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MatchViewUi from './MatchViewUi';

import type { Match } from './contracts';

type MatchViewProps = {
  matches: Match[];
  error?: string | null;
};

const MatchView = ({ matches, error }: MatchViewProps) => {
  const router = useRouter();

  // Freshness nudge:
  // - ensures that if the user navigated here from a prefetched/router-cached payload,
  //   we still request the latest server-rendered data after any on-demand revalidation.
  useEffect(() => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    const refreshIfVisible = () => {
      if (document.visibilityState === 'visible') router.refresh();
    };

    document.addEventListener('visibilitychange', refreshIfVisible);
    window.addEventListener('focus', refreshIfVisible);

    return () => {
      document.removeEventListener('visibilitychange', refreshIfVisible);
      window.removeEventListener('focus', refreshIfVisible);
    };
  }, [router]);

  return <MatchViewUi matches={matches} error={error} />;
};

export default MatchView;
