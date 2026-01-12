import type { Player } from '@/domains/player/contracts';

export type PlayerStanding = Player & {
  teamName: string;
  statValue: number;
  rank: number;
};

export type StandingsCategory = {
  title: string;
  players: PlayerStanding[];
};

export type PlayersPageData = {
  standings: StandingsCategory[];
};
