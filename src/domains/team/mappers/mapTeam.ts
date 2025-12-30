import { Team } from '../contracts';
import { TeamsQuery } from '@/graphql';
export const mapTeam = (team: TeamsQuery['teams'][number]): Team => {
	return {
		id: team.id,
		name: team.name ?? '',
	};
};
