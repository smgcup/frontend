import type { TeamCreate, TeamUpdate } from '@/domains/team/contracts';
import type { CreateTeamDto, UpdateTeamDto } from '@/graphql';

export const mapTeamCreateToDto = (input: TeamCreate): CreateTeamDto => {
  return { name: input.name };
};

export const mapTeamUpdateToDto = (input: TeamUpdate): UpdateTeamDto => {
  return { name: input.name };
};


