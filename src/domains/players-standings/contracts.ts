import type { Player } from '@/domains/player/contracts';
import type { CategoryType } from './constants';
export type PlayerStanding = Player & {
  teamName: string;
  rank: number;
};

export type StandingsCategory = {
  title: CategoryType;
  players: PlayerStanding[];
};

export type PlayersPageData = {
  standings: StandingsCategory[];
};
