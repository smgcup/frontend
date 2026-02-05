import { getPublicClient } from '@/lib/initializeApollo';
import {
  GetTeamsDocument,
  GetNewsDocument,
  GetMatchesDocument,
  GetHeroStatisticsDocument,
  GetTopPlayersDocument,
} from '@/graphql';
import { mapTeam } from '@/domains/team/mappers/mapTeam';
import { mapNews } from '@/domains/news/mappers/mapNews';
import { mapMatch } from '@/domains/matches/mappers/mapMatch';
import { mapHeroStatistics } from '@/domains/home/mappers/mapHeroStatistics';
import { mapTopPlayer } from '@/domains/home/mappers/mapTopPlayer';

/**
 * Fetches all data needed for the homepage.
 *
 * With ISR (Incremental Static Regeneration):
 * - This function runs at build time to generate the initial static page
 * - After the revalidate period (set in page.tsx), it runs again in the background
 * - No need for unstable_cache here - the entire page output is cached by ISR
 *
 * We use getPublicClient() because:
 * - This page has no user-specific content
 * - Public client doesn't use headers(), making it compatible with static generation
 */
export const getHomePageData = async () => {
  const client = getPublicClient();

  // Fetch all data in parallel for optimal performance
  const [teamsResult, newsResult, matchesResult, heroStatsResult, topPlayersResult] =
    await Promise.all([
      client.query({ query: GetTeamsDocument }),
      client.query({ query: GetNewsDocument }),
      client.query({ query: GetMatchesDocument }),
      client.query({ query: GetHeroStatisticsDocument }),
      client.query({ query: GetTopPlayersDocument }),
    ]);

  // Map GraphQL responses to domain contracts
  return {
    teams: teamsResult.data?.teams.map(mapTeam) ?? [],
    news: newsResult.data?.news.map(mapNews) ?? [],
    matches: matchesResult.data?.matches.map(mapMatch) ?? [],
    heroStatistics: mapHeroStatistics(heroStatsResult.data?.statistics),
    topPlayers: topPlayersResult.data?.topPlayers.map(mapTopPlayer) ?? [],
  };
};
