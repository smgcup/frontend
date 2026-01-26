import type { PlayerPosition } from '@/graphql';
import type { CategoryType } from './constants';
import type { Team } from '@/domains/team/contracts';

export type LeaderboardPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  imageUrl: string | null;
  team?: Team;
  stats?: {
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  } | null;
};

export type PlayerStanding = LeaderboardPlayer & {
  rank: number;
  statValue: number;
};

export type StandingsCategory = {
  title: CategoryType;
  players: PlayerStanding[];
  hasMore: boolean;
  totalCount: number;
};

export type PlayersPageData = {
  standings: StandingsCategory[];
  loading: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  hasMore: boolean;
};
