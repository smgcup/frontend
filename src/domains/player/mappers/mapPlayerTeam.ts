import type { PlayerTeam } from '../contracts';

type TeamLike = {
  id: string;
  name?: string | null;
};

export const mapPlayerTeam = (team: TeamLike): PlayerTeam => {
  return {
    id: team.id,
    name: team.name ?? '',
  };
};
