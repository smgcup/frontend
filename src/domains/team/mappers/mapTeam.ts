import type { Team } from '../contracts';

type TeamLike = {
  id: string;
  name?: string | null;
};

export const mapTeam = (team: TeamLike): Team => {
  return {
    id: team.id,
    name: team.name ?? '',
  };
};
