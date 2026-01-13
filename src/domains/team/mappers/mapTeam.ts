import { Team } from '../contracts';
import { GetTeamsQuery } from '@/graphql';

export const mapTeam = (team: GetTeamsQuery['teams'][0]): Team => {
  return {
    id: team.id,
    name: team.name,
  };
};
