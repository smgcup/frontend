import type { Team } from '../../team/contracts';

export const mapTeamFromQuery = (team: Team) => {
  return {
    id: team.id,
    name: team.name,
  };
};
