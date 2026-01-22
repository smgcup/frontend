import React from 'react';
import { LoginInput } from '@/graphql';

import AuthCard from '../shared/components/AuthCard';

type LoginViewUiProps = {
  onLogin: (e: React.FormEvent<HTMLFormElement>, loginInput: LoginInput) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loginUserLoading: boolean;
  loginInput: LoginInput;
  errorMessage: string | null;
};

const LoginViewUi = ({ onLogin, onInputChange, loginUserLoading, loginInput, errorMessage }: LoginViewUiProps) => {
  return (
    <>
      <AuthCard
        // children={<></>}
        title="Welcome back!"
        description="Login to access your account."
        onSubmit={onLogin}
        input={loginInput}
        onInputChange={onInputChange}
        loading={loginUserLoading}
        errorMessage={errorMessage}
      />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <a href="#" className="text-primary hover:underline font-medium">
          Register
        </a>
      </p>
    </>
  );
};

export default LoginViewUi;
