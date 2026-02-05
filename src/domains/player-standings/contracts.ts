import type { CategoryType } from './constants';
import type { Player } from '@/domains/player/contracts';

export type PlayerStanding = Player & {
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
