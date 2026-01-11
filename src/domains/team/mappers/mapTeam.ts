import { Team } from '../contracts';
import { TeamsQuery } from '@/graphql';

export const mapTeam = (team: TeamsQuery['teams'][0]): Team => {
  return {
    id: team.id,
    name: team.name,
  };
};
