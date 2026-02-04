import { unstable_cache } from 'next/cache';
import { getPublicClient } from '@/lib/initializeApollo';
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
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapNews } from '@/domains/news/mappers/mapNews';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapMatchEvent } from '@/domains/matches/mappers/mapMatchEvent';
import { mapPlayer } from '@/domains/player/mappers/mapPlayer';
import { mapTopPlayer } from '@/domains/home/mappers/mapTopPlayer';
import { mapHeroStatistics } from '@/domains/home/mappers/mapHeroStatistics';

// Cache duration in seconds
const ONE_HOUR = 3600;
const FIVE_MINUTES = 300;

export const getTeamsData = unstable_cache(
  async () => {
    const client = getPublicClient();
    const { data } = await client.query<GetTeamsQuery, GetTeamsQueryVariables>({
      query: GetTeamsDocument,
    });
    return data?.teams.map(mapTeam) ?? [];
  },
  ['teams'],
  { revalidate: ONE_HOUR },
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
    { revalidate: ONE_HOUR },
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
  { revalidate: FIVE_MINUTES },
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
    { revalidate: FIVE_MINUTES },
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
  { revalidate: FIVE_MINUTES },
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
    { revalidate: FIVE_MINUTES },
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
    { revalidate: FIVE_MINUTES },
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
    { revalidate: ONE_HOUR },
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
  { revalidate: FIVE_MINUTES },
);

export const getTopPlayersData = unstable_cache(
  async () => {
    const client = getPublicClient();
    const { data } = await client.query<GetTopPlayersQuery, GetTopPlayersQueryVariables>({
      query: GetTopPlayersDocument,
    });
    return data?.topPlayers.map(mapTopPlayer) ?? [];
  },
  ['top-players'],
  { revalidate: FIVE_MINUTES },
);
