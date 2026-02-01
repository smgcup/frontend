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
import { TopPlayer } from '@/domains/home/contracts';

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
  const shortenPosition = (position: string): string => {
    const map: Record<string, string> = {
      GOALKEEPER: 'GK',
      DEFENDER: 'DEF',
      MIDFIELDER: 'MID',
      FORWARD: 'FWD',
    };
    return map[position] ?? position;
  };

  const topPlayers: TopPlayer[] =
    topPlayersData?.topPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      teamId: p.teamId,
      teamName: p.teamName,
      position: shortenPosition(p.position),
      goals: p.goals,
      assists: p.assists,
      yellowCards: p.yellowCards,
      redCards: p.redCards,
      ownGoals: p.ownGoals,
    })) ?? [];

  const heroStatistics = statsData?.statistics
    ? {
        teamsCount: statsData.statistics.teamsCount,
        matchesPlayedCount: statsData.statistics.matchesPlayedCount,
        totalGoals: statsData.statistics.totalGoals,
        avgGoalsPerMatch:
          statsData.statistics.matchesPlayedCount > 0
            ? Number((statsData.statistics.totalGoals / statsData.statistics.matchesPlayedCount).toFixed(2))
            : 0,
      }
    : { teamsCount: 0, matchesPlayedCount: 0, totalGoals: 0, avgGoalsPerMatch: 0 };

  const error = teamsError || newsError || matchesError || statsError || topPlayersError;

  return { teams, news, matches, heroStatistics, topPlayers, error };
};
