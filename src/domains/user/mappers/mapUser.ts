import type { GetMeQuery } from '@/graphql';
import type { User } from '../contracts';

type UserFromQuery = GetMeQuery['user'];

export const mapUser = (user: UserFromQuery): User => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};
