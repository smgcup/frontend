export type HeroStatistics = {
  teamsCount: number;
  matchesPlayedCount: number;
  totalGoals: number;
  avgGoalsPerMatch: number;
};

export type TopPlayer = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  position: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  ownGoals: number;
};
