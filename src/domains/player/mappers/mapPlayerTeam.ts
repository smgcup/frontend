import type { Team } from '../../team/contracts';

type TeamLike = {
  id: string;
  name?: string | null;
};

export const mapPlayerTeam = (team: TeamLike): Team => {
  return {
    id: team.id,
    name: team.name ?? '',
  };
};
