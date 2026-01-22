import { useMutation } from '@apollo/client/react';
import { LoginInput, LoginUserDocument, LoginUserMutation, LoginUserMutationVariables } from '@/graphql';
import { setCookie } from '@/lib/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { getTranslationCodeMessage } from '@/errors/getTranslationCode';

export const useAuthView = () => {
  const [loginInput, setLoginInput] = useState<LoginInput>({ email: '', password: '' });

  const router = useRouter();

  const [loginUserMutation, { loading: loginUserLoading, error: loginUserError }] = useMutation<
    LoginUserMutation,
    LoginUserMutationVariables
  >(LoginUserDocument, {
    onCompleted: (data) => {
      if (data.login?.accessToken) {
        setCookie(AUTH_COOKIE_NAME, data.login.accessToken, 7);
        router.push('/inbox');
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, loginInput: LoginInput) => {
    e.preventDefault();
    await loginUserMutation({
      variables: {
        loginInput,
      },
    });
  };

  const errorMessage = loginUserError ? getTranslationCodeMessage(loginUserError) : null;
  return {
    onLogin: handleSubmit,
    onInputChange: handleChange,
    loginUserLoading,
    loginUserError,
    loginInput,
    errorMessage,
  };
};
