import { getClient } from '@/lib/initializeApollo';
import {
  GetTeamsDocument,
  GetTeamsQuery,
  GetTeamsQueryVariables,
  GetNewsDocument,
  GetNewsQuery,
  GetNewsQueryVariables,
  GetMatchesDocument,
  GetMatchesQuery,
  GetMatchesQueryVariables,
  GetHeroStatisticsDocument,
  GetHeroStatisticsQuery,
  GetHeroStatisticsQueryVariables,
  GetTopPlayersDocument,
  GetTopPlayersQuery,
  GetTopPlayersQueryVariables,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapNews } from '@/domains/news/mappers/mapNews';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapTopPlayer } from '@/domains/home/mappers/mapTopPlayer';
import { mapHeroStatistics } from '@/domains/home/mappers/mapHeroStatistics';

export const getHomePageData = async () => {
  const client = await getClient();

  const { data: teamsData, error: teamsError } = await client.query<GetTeamsQuery, GetTeamsQueryVariables>({
    query: GetTeamsDocument,
  });

  const { data: newsData, error: newsError } = await client.query<GetNewsQuery, GetNewsQueryVariables>({
    query: GetNewsDocument,
  });

  const { data: matchesData, error: matchesError } = await client.query<GetMatchesQuery, GetMatchesQueryVariables>({
    query: GetMatchesDocument,
  });

  const { data: statsData, error: statsError } = await client.query<
    GetHeroStatisticsQuery,
    GetHeroStatisticsQueryVariables
  >({
    query: GetHeroStatisticsDocument,
  });

  const { data: topPlayersData, error: topPlayersError } = await client.query<
    GetTopPlayersQuery,
    GetTopPlayersQueryVariables
  >({
    query: GetTopPlayersDocument,
  });

  const teams = teamsData?.teams.map(mapTeam) ?? [];
  const news = newsData?.news.map(mapNews) ?? [];
  const matches = matchesData?.matches.map(mapMatch) ?? [];
  const topPlayers = topPlayersData?.topPlayers.map(mapTopPlayer) ?? [];

  const heroStatistics = mapHeroStatistics(statsData?.statistics);

  const error = teamsError || newsError || matchesError || statsError || topPlayersError;

  return { teams, news, matches, heroStatistics, topPlayers, error };
};
