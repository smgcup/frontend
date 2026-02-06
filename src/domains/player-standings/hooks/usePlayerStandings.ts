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
import { ALL_SORT_TYPES, LEADERBOARD_LIMIT, SORT_TYPE_TO_CATEGORY, getStatValue } from '../constants';
import type { StandingsCategory, PlayerStanding, PlayersPageData } from '../contracts';

export const usePlayerStandings = (initialStandings: StandingsCategory[]): PlayersPageData => {
  const skipFirstAutoLoadMoreRef = useRef(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const goalsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.Goals, page: 1, limit: LEADERBOARD_LIMIT },
  });

  const assistsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.Assists, page: 1, limit: LEADERBOARD_LIMIT },
  });

  const cleanSheetsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.CleanSheets, page: 1, limit: LEADERBOARD_LIMIT },
  });

  const redCardsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.RedCards, page: 1, limit: LEADERBOARD_LIMIT },
  });

  const yellowCardsQuery = useQuery<GetLeaderboardQuery, GetLeaderboardQueryVariables>(GetLeaderboardDocument, {
    variables: { sortBy: LeaderboardSortType.YellowCards, page: 1, limit: LEADERBOARD_LIMIT },
  });

  const queries = useMemo(
    () => ({
      [LeaderboardSortType.Goals]: goalsQuery,
      [LeaderboardSortType.Assists]: assistsQuery,
      [LeaderboardSortType.CleanSheets]: cleanSheetsQuery,
      [LeaderboardSortType.RedCards]: redCardsQuery,
      [LeaderboardSortType.YellowCards]: yellowCardsQuery,
    }),
    [goalsQuery, assistsQuery, cleanSheetsQuery, redCardsQuery, yellowCardsQuery],
  );

  // Only switch to Apollo data when it has more players than SSR (i.e. after fetchMore),
  // or on back-navigation when Apollo cache already has multi-page data.
  // This avoids a flicker when Apollo re-fetches the same page-1 data on initial hydration.
  const allQueriesReady = ALL_SORT_TYPES.every((sortType) => queries[sortType].data !== undefined);
  const apolloPlayerCount = ALL_SORT_TYPES.reduce(
    (sum, sortType) => sum + (queries[sortType].data?.playersLeaderboard.players.length ?? 0),
    0,
  );
  const ssrPlayerCount = initialStandings.reduce((sum, cat) => sum + cat.players.length, 0);
  const useApolloData = allQueriesReady && apolloPlayerCount > ssrPlayerCount;

  const hasMore = useApolloData
    ? ALL_SORT_TYPES.some((sortType) => queries[sortType].data?.playersLeaderboard.hasMore ?? true)
    : initialStandings.some((cat) => cat.hasMore);

  const standings: StandingsCategory[] = useMemo(() => {
    if (!useApolloData) return initialStandings;

    return ALL_SORT_TYPES.map((sortType) => {
      const leaderboard = queries[sortType].data?.playersLeaderboard;
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
  }, [useApolloData, initialStandings, queries]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !allQueriesReady) return;

    setLoadingMore(true);
    try {
      await Promise.all(
        ALL_SORT_TYPES.map((sortType) => {
          const query = queries[sortType];
          const currentHasMore = query.data?.playersLeaderboard.hasMore ?? false;

          if (!currentHasMore) return Promise.resolve();

          const currentCount = query.data?.playersLeaderboard.players.length ?? 0;
          const nextPage = Math.floor(currentCount / LEADERBOARD_LIMIT) + 1;

          return query.fetchMore({
            variables: { page: nextPage },
          });
        }),
      );
    } finally {
      setLoadingMore(false);
    }
  }, [queries, loadingMore, hasMore, allQueriesReady]);

  return {
    standings,
    loading: false,
    loadingMore,
    loadMore: async () => {
      if (skipFirstAutoLoadMoreRef.current) {
        skipFirstAutoLoadMoreRef.current = false;
        return;
      }
      return loadMore();
    },
    hasMore,
  };
};
