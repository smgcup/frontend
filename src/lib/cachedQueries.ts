import { unstable_cache } from 'next/cache';
import { getPublicClient } from '@/lib/initializeApollo';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';
import {
  GetTeamsDocument,
  GetTeamsQuery,
  GetTeamsQueryVariables,
  GetNewsDocument,
  GetNewsQuery,
  GetNewsQueryVariables,
  GetNewsByIdDocument,
  GetNewsByIdQuery,
  GetNewsByIdQueryVariables,
  GetMatchesDocument,
  GetMatchesQuery,
  GetMatchesQueryVariables,
  MatchByIdDocument,
  MatchByIdQuery,
  MatchByIdQueryVariables,
  MatchEventsDocument,
  MatchEventsQuery,
  MatchEventsQueryVariables,
  GetHeroStatisticsDocument,
  GetHeroStatisticsQuery,
  GetHeroStatisticsQueryVariables,
  GetTopPlayersDocument,
  GetTopPlayersQuery,
  GetTopPlayersQueryVariables,
  PlayerByIdDocument,
  PlayerByIdQuery,
  PlayerByIdQueryVariables,
  TeamByIdDocument,
  TeamByIdQuery,
  TeamByIdQueryVariables,
  GetLeaderboardDocument,
  GetLeaderboardQuery,
  GetLeaderboardQueryVariables,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapNews } from '@/domains/news/mappers/mapNews';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';
import { mapHeroStatistics } from '@/domains/home/mappers/mapHeroStatistics';
import {
  ALL_SORT_TYPES,
  SORT_TYPE_TO_CATEGORY,
  LEADERBOARD_LIMIT,
  getStatValue,
} from '@/domains/player-standings/constants';
import type { StandingsCategory, PlayerStanding } from '@/domains/player-standings/contracts';

// Cache duration in seconds
const ONE_HOUR = 3600;
const FIVE_MINUTES = 300;

export const getTeamsData = unstable_cache(
  async () => {
    const client = getPublicClient();
    const { data } = await client.query<GetTeamsQuery, GetTeamsQueryVariables>({
      query: GetTeamsDocument,
      variables: {
        leaderboardOrder: true,
        withStats: true,
      },
    });
    return data?.teams.map(mapTeam) ?? [];
  },
  ['teams'],
  { revalidate: FIVE_MINUTES, tags: ['teams'] },
);

export const getTeamByIdData = (teamId: string) =>
  unstable_cache(
    async () => {
      const client = getPublicClient();
      const { data } = await client.query<TeamByIdQuery, TeamByIdQueryVariables>({
        query: TeamByIdDocument,
        variables: { id: teamId },
      });
      return data?.teamById ? mapTeam(data.teamById) : null;
    },
    ['team', teamId],
    { revalidate: FIVE_MINUTES, tags: ['teams'] },
  )();

export const getNewsData = unstable_cache(
  async () => {
    const client = getPublicClient();
    const { data } = await client.query<GetNewsQuery, GetNewsQueryVariables>({
      query: GetNewsDocument,
    });
    return data?.news.map(mapNews) ?? [];
  },
  ['news'],
  { revalidate: FIVE_MINUTES, tags: ['news'] },
);

export const getNewsByIdData = (newsId: string) =>
  unstable_cache(
    async () => {
      const client = getPublicClient();
      const { data } = await client.query<GetNewsByIdQuery, GetNewsByIdQueryVariables>({
        query: GetNewsByIdDocument,
        variables: { newsByIdId: newsId },
      });
      return data?.newsById ? mapNews(data.newsById) : null;
    },
    ['news', newsId],
    { revalidate: FIVE_MINUTES, tags: ['news'] },
  )();

export const getMatchesData = unstable_cache(
  async () => {
    const client = getPublicClient();
    const { data } = await client.query<GetMatchesQuery, GetMatchesQueryVariables>({
      query: GetMatchesDocument,
    });
    return data?.matches.map(mapMatch) ?? [];
  },
  ['matches'],
  { revalidate: FIVE_MINUTES, tags: ['matches-list'] },
);

export const getMatchByIdData = (matchId: string) =>
  unstable_cache(
    async () => {
      const client = getPublicClient();
      const { data } = await client.query<MatchByIdQuery, MatchByIdQueryVariables>({
        query: MatchByIdDocument,
        variables: { id: matchId },
      });
      return data?.matchById ? mapMatch(data.matchById) : null;
    },
    ['match', matchId],
    { revalidate: FIVE_MINUTES, tags: [`match-${matchId}`] },
  )();

export const getMatchEventsData = (matchId: string) =>
  unstable_cache(
    async () => {
      const client = getPublicClient();
      const { data } = await client.query<MatchEventsQuery, MatchEventsQueryVariables>({
        query: MatchEventsDocument,
        variables: { matchId },
      });
      return data?.matchEvents.map(mapMatchEvent) ?? [];
    },
    ['match-events', matchId],
    { revalidate: FIVE_MINUTES, tags: [`match-events-${matchId}`] },
  )();

export const getPlayerByIdData = (playerId: string) =>
  unstable_cache(
    async () => {
      const client = getPublicClient();
      const { data } = await client.query<PlayerByIdQuery, PlayerByIdQueryVariables>({
        query: PlayerByIdDocument,
        variables: { id: playerId },
      });
      return data?.playerById ? mapPlayer(data.playerById) : null;
    },
    ['player', playerId],
    { revalidate: ONE_HOUR, tags: ['players'] },
  )();

export const getHeroStatisticsData = unstable_cache(
  async () => {
    const client = getPublicClient();
    const { data } = await client.query<GetHeroStatisticsQuery, GetHeroStatisticsQueryVariables>({
      query: GetHeroStatisticsDocument,
    });
    return mapHeroStatistics(data?.statistics);
  },
  ['hero-statistics'],
  { revalidate: FIVE_MINUTES, tags: ['statistics'] },
);

export const getTopPlayersData = unstable_cache(
  async () => {
    const client = getPublicClient();
    const { data } = await client.query<GetTopPlayersQuery, GetTopPlayersQueryVariables>({
      query: GetTopPlayersDocument,
    });
    return data?.topPlayers.map(mapPlayer) ?? [];
  },
  ['top-players'],
  { revalidate: FIVE_MINUTES, tags: ['players'] },
);

export const getLeaderboardData = unstable_cache(
  async (): Promise<StandingsCategory[]> => {
    const client = getPublicClient();

    const results = await Promise.all(
      ALL_SORT_TYPES.map((sortType) =>
        client.query<GetLeaderboardQuery, GetLeaderboardQueryVariables>({
          query: GetLeaderboardDocument,
          variables: { sortBy: sortType, page: 1, limit: LEADERBOARD_LIMIT },
        }),
      ),
    );

    return ALL_SORT_TYPES.map((sortType, index) => {
      const leaderboard = results[index].data?.playersLeaderboard;
      const players: PlayerStanding[] =
        leaderboard?.players.map((player, playerIndex) => ({
          ...mapPlayer(player),
          rank: playerIndex + 1,
          statValue: getStatValue(player.stats, sortType),
        })) ?? [];

      return {
        title: SORT_TYPE_TO_CATEGORY[sortType],
        players,
        hasMore: leaderboard?.hasMore ?? false,
        totalCount: leaderboard?.totalCount ?? 0,
      };
    });
  },
  ['leaderboard'],
  { revalidate: FIVE_MINUTES, tags: ['leaderboard'] },
);
