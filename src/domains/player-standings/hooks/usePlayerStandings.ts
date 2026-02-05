'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  GetLeaderboardDocument,
  GetLeaderboardQuery,
  GetLeaderboardQueryVariables,
  LeaderboardSortType,
} from '@/graphql';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';
import { ALL_SORT_TYPES, SORT_TYPE_TO_CATEGORY } from '../constants';
import type { StandingsCategory, PlayerStanding, PlayersPageData } from '../contracts';

const LIMIT = 20;

type LeaderboardResult = {
  data: GetLeaderboardQuery | undefined;
  loading: boolean;
  fetchMore: (options: {
    variables: Partial<GetLeaderboardQueryVariables>;
    updateQuery?: (prev: GetLeaderboardQuery, options: { fetchMoreResult: GetLeaderboardQuery }) => GetLeaderboardQuery;
  }) => Promise<unknown>;
};

// Get the stat value for a player based on the sort type
const getStatValue = (
  stats: { goals: number; assists: number; yellowCards: number; redCards: number } | null | undefined,
  sortType: LeaderboardSortType,
): number => {
  if (!stats) return 0;
  switch (sortType) {
    case LeaderboardSortType.Goals:
      return stats.goals;
    case LeaderboardSortType.Assists:
      return stats.assists;
    case LeaderboardSortType.YellowCards:
      return stats.yellowCards;
    case LeaderboardSortType.RedCards:
      return stats.redCards;
    case LeaderboardSortType.CleanSheets:
      // CleanSheets not in stats, return 0 for now
      return 0;
    default:
      return 0;
  }
};

export const usePlayerStandings = (): PlayersPageData => {
  const [loadingMore, setLoadingMore] = useState(false);
  const fetchMoreRefs = useRef<Map<LeaderboardSortType, LeaderboardResult['fetchMore']>>(new Map());
  const skipFirstAutoLoadMoreRef = useRef(true);

  // Query for Goals
  const goalsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.Goals, page: 1, limit: LIMIT },
  });

  // Query for Assists
  const assistsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.Assists, page: 1, limit: LIMIT },
  });

  // Query for Clean Sheets
  const cleanSheetsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.CleanSheets, page: 1, limit: LIMIT },
  });

  // Query for Red Cards
  const redCardsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.RedCards, page: 1, limit: LIMIT },
  });

  // Query for Yellow Cards
  const yellowCardsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.YellowCards, page: 1, limit: LIMIT },
  });

  // Store fetchMore refs
  fetchMoreRefs.current.set(LeaderboardSortType.Goals, goalsQuery.fetchMore);
  fetchMoreRefs.current.set(LeaderboardSortType.Assists, assistsQuery.fetchMore);
  fetchMoreRefs.current.set(LeaderboardSortType.CleanSheets, cleanSheetsQuery.fetchMore);
  fetchMoreRefs.current.set(LeaderboardSortType.RedCards, redCardsQuery.fetchMore);
  fetchMoreRefs.current.set(LeaderboardSortType.YellowCards, yellowCardsQuery.fetchMore);

  // Map queries by sort type
  const queriesBySortType: Record<LeaderboardSortType, { data?: GetLeaderboardQuery; loading: boolean }> = {
    [LeaderboardSortType.Goals]: goalsQuery,
    [LeaderboardSortType.Assists]: assistsQuery,
    [LeaderboardSortType.CleanSheets]: cleanSheetsQuery,
    [LeaderboardSortType.RedCards]: redCardsQuery,
    [LeaderboardSortType.YellowCards]: yellowCardsQuery,
  };

  // Check if initial data is still loading (no data yet)
  // We only show full-page loading when there's no data at all
  const hasAnyData =
    goalsQuery.data || assistsQuery.data || cleanSheetsQuery.data || redCardsQuery.data || yellowCardsQuery.data;

  const isAnyQueryLoading =
    goalsQuery.loading ||
    assistsQuery.loading ||
    cleanSheetsQuery.loading ||
    redCardsQuery.loading ||
    yellowCardsQuery.loading;

  // Only show full-page loading on initial load (when there's no data yet)
  const loading = isAnyQueryLoading && !hasAnyData;

  // Check if any category has more data
  const hasMore = ALL_SORT_TYPES.some((sortType) => {
    const query = queriesBySortType[sortType];
    return query.data?.playersLeaderboard.hasMore ?? true;
  });

  // Transform query results into standings categories
  const standings: StandingsCategory[] = useMemo(() => {
    const dataByType: Record<LeaderboardSortType, GetLeaderboardQuery | undefined> = {
      [LeaderboardSortType.Goals]: goalsQuery.data,
      [LeaderboardSortType.Assists]: assistsQuery.data,
      [LeaderboardSortType.CleanSheets]: cleanSheetsQuery.data,
      [LeaderboardSortType.RedCards]: redCardsQuery.data,
      [LeaderboardSortType.YellowCards]: yellowCardsQuery.data,
    };

    return ALL_SORT_TYPES.map((sortType) => {
      const leaderboard = dataByType[sortType]?.playersLeaderboard;
      const categoryTitle = SORT_TYPE_TO_CATEGORY[sortType];

      const players: PlayerStanding[] =
        leaderboard?.players.map((player, index) => ({
          ...mapPlayer(player),
          rank: index + 1,
          statValue: getStatValue(player.stats, sortType),
        })) ?? [];

      return {
        title: categoryTitle,
        players,
        hasMore: leaderboard?.hasMore ?? false,
        totalCount: leaderboard?.totalCount ?? 0,
      };
    });
  }, [goalsQuery.data, assistsQuery.data, cleanSheetsQuery.data, redCardsQuery.data, yellowCardsQuery.data]);

  // Load more data for all categories
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const dataByType: Record<LeaderboardSortType, GetLeaderboardQuery | undefined> = {
      [LeaderboardSortType.Goals]: goalsQuery.data,
      [LeaderboardSortType.Assists]: assistsQuery.data,
      [LeaderboardSortType.CleanSheets]: cleanSheetsQuery.data,
      [LeaderboardSortType.RedCards]: redCardsQuery.data,
      [LeaderboardSortType.YellowCards]: yellowCardsQuery.data,
    };

    try {
      await Promise.all(
        ALL_SORT_TYPES.map((sortType) => {
          const fetchMore = fetchMoreRefs.current.get(sortType);
          const currentHasMore = dataByType[sortType]?.playersLeaderboard.hasMore ?? false;

          if (!fetchMore || !currentHasMore) return Promise.resolve();

          const currentCount = dataByType[sortType]?.playersLeaderboard.players.length ?? 0;
          const nextPage = Math.floor(currentCount / LIMIT) + 1;

          return fetchMore({
            // Apollo cache typePolicy handles merging pages; we only request the next page.
            variables: { page: nextPage },
          });
        }),
      );
    } finally {
      setLoadingMore(false);
    }
  }, [
    loadingMore,
    hasMore,
    goalsQuery.data,
    assistsQuery.data,
    cleanSheetsQuery.data,
    redCardsQuery.data,
    yellowCardsQuery.data,
  ]);

  return {
    standings,
    loading,
    loadingMore,
    loadMore: async () => {
      // Prevent an immediate network request when navigating back to the page
      // (IntersectionObserver can fire right away if the sentinel is visible).
      if (skipFirstAutoLoadMoreRef.current) {
        skipFirstAutoLoadMoreRef.current = false;
        return;
      }
      return loadMore();
    },
    hasMore,
  };
};
