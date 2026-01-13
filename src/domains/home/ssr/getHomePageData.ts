import { getClient } from '@/lib/initializeApollo';
import {
  GetTeamsDocument,
  GetTeamsQuery,
  GetTeamsQueryVariables,
  GetNewsDocument,
  GetNewsQuery,
  GetNewsQueryVariables,
  MatchesDocument,
  MatchesQuery,
  MatchesQueryVariables,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapNews } from '@/domains/news/mappers/mapNews';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';

export const getHomePageData = async () => {
  const client = await getClient();

  const { data: teamsData, error: teamsError } = await client.query<GetTeamsQuery, GetTeamsQueryVariables>({
    query: GetTeamsDocument,
  });

  const { data: newsData, error: newsError } = await client.query<GetNewsQuery, GetNewsQueryVariables>({
    query: GetNewsDocument,
  });

  const { data: matchesData, error: matchesError } = await client.query<MatchesQuery, MatchesQueryVariables>({
    query: MatchesDocument,
  });
  const teams = teamsData?.teams.map(mapTeam) ?? [];
  const news = newsData?.news.map(mapNews) ?? [];
  const matches = matchesData?.matches.map(mapMatch) ?? [];

  const error = teamsError || newsError || matchesError;

  return { teams, news, matches, error };
};
