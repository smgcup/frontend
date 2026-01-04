import { setContext } from '@apollo/client/link/context';
import { getCookie } from './cookies';

const AUTH_COOKIE_NAME = 'auth_token';

// Apollo auth link for adding authorization headers
export const createAuthLink = () => {
  const authLink = setContext((_, { headers }) => {
    const token = getCookie(AUTH_COOKIE_NAME);

    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    };
  });

  return authLink;
};

export { AUTH_COOKIE_NAME };
