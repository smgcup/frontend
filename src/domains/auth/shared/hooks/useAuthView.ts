import { useMutation } from '@apollo/client/react';
import {
  LoginInput,
  LoginUserDocument,
  LoginUserMutation,
  LoginUserMutationVariables,
  RegisterUserInput,
  RegisterUserDocument,
  RegisterUserMutation,
  RegisterUserMutationVariables,
} from '@/graphql';
import { setCookie } from '@/lib/cookies';
import { AUTH_COOKIE_NAME } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { getTranslationCodeMessage } from '@/errors/getTranslationCode';

export const useAuthView = () => {
  const [loginInput, setLoginInput] = useState<LoginInput>({ email: '', password: '' });
  const [registerInput, setRegisterInput] = useState<RegisterUserInput>({
    email: '',
    password: '',
    username: '',
    firstName: '',
    lastName: '',
  });
  const router = useRouter();
  const redirectTo = '/games';

  const [loginUserMutation, { loading: loginUserLoading, error: loginUserError }] = useMutation<
    LoginUserMutation,
    LoginUserMutationVariables
  >(LoginUserDocument, {
    onCompleted: (data) => {
      if (data.login?.accessToken) {
        setCookie(AUTH_COOKIE_NAME, data.login.accessToken, 7);
        router.push(redirectTo);
      }
    },
  });

  const [registerUserMutation, { loading: registerUserLoading, error: registerUserError }] = useMutation<
    RegisterUserMutation,
    RegisterUserMutationVariables
  >(RegisterUserDocument, {
    onCompleted: (data) => {
      if (data.register?.accessToken) {
        setCookie(AUTH_COOKIE_NAME, data.register.accessToken, 7);
        router.push(redirectTo);
      }
    },
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLButtonElement>) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>, loginInput: LoginInput) => {
    e.preventDefault();
    await loginUserMutation({
      variables: {
        loginInput,
      },
    });
  };
  const handleRegisterSubmit = async (e: FormEvent<HTMLFormElement>, registerInput: RegisterUserInput) => {
    e.preventDefault();
    await registerUserMutation({
      variables: {
        registerInput,
      },
    });
  };
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLButtonElement>) => {
    setRegisterInput({ ...registerInput, [e.target.name]: e.target.value });
  };

  const loginErrorMessage = loginUserError ? getTranslationCodeMessage(loginUserError) : null;
  const registerErrorMessage = registerUserError ? getTranslationCodeMessage(registerUserError) : null;

  return {
    onLogin: handleLoginSubmit,
    onLoginInputChange: handleLoginChange,
    onRegister: handleRegisterSubmit,
    onRegisterInputChange: handleRegisterChange,
    loginUserLoading,
    loginErrorMessage,
    registerUserLoading,
    registerErrorMessage,
    loginInput,
    registerInput,
  };
};
