import { Team } from '../contracts';
import { GetTeamsQuery } from '@/graphql';

export const mapTeam = (team: GetTeamsQuery['teams'][number]): Team => {
  return {
    id: team.id,
    name: team.name,
  };
};
